 
const TECH_SKILLS = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'ruby', 'php',
  'react', 'vue', 'angular', 'svelte', 'nextjs', 'nuxt', 'node', 'express', 'nestjs',
  'html', 'css', 'sass', 'scss', 'tailwind', 'bootstrap', 'material-ui',
  'mongodb', 'mysql', 'postgresql', 'sqlite', 'redis', 'elasticsearch',
  'aws', 'azure', 'gcp', 'firebase', 'heroku', 'vercel', 'netlify',
  'docker', 'kubernetes', 'jenkins', 'github-actions', 'gitlab-ci', 'circleci',
  'git', 'github', 'gitlab', 'bitbucket',
  'rest', 'graphql', 'grpc', 'websocket', 'api', 'json', 'xml',
  'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'matplotlib',
  'agile', 'scrum', 'kanban', 'jira', 'confluence',
  'linux', 'ubuntu', 'centos', 'bash', 'shell', 'powershell',
  'jest', 'mocha', 'cypress', 'selenium', 'junit', 'testing'
];

// Common buzzwords to avoid
const BUZZWORDS = [
  'hardworking', 'team player', 'detail-oriented', 'self-starter', 'motivated',
  'passionate', 'enthusiastic', 'dedicated', 'proactive', 'results-driven',
  'go-getter', 'think outside the box', 'synergy', 'leverage', 'streamline'
];

// Action verbs that indicate strong experience
const ACTION_VERBS = [
  'developed', 'built', 'created', 'implemented', 'designed', 'architected',
  'optimized', 'improved', 'increased', 'decreased', 'reduced', 'enhanced',
  'led', 'managed', 'coordinated', 'collaborated', 'mentored', 'trained',
  'deployed', 'maintained', 'tested', 'debugged', 'refactored', 'automated',
  'analyzed', 'researched', 'evaluated', 'measured', 'monitored'
];

// Extract keywords from text
const extractKeywords = (text) => {
  const normalizedText = text.toLowerCase();
  const words = normalizedText.match(/\b\w+\b/g) || [];
  
  const foundSkills = [];
  const foundBuzzwords = [];
  const foundVerbs = [];
  
  // Check for technical skills
  TECH_SKILLS.forEach(skill => {
    if (normalizedText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });
  
  // Check for buzzwords
  BUZZWORDS.forEach(buzz => {
    if (normalizedText.includes(buzz.toLowerCase())) {
      foundBuzzwords.push(buzz);
    }
  });
  
  // Check for action verbs
  ACTION_VERBS.forEach(verb => {
    if (normalizedText.includes(verb.toLowerCase())) {
      foundVerbs.push(verb);
    }
  });
  
  return {
    skills: [...new Set(foundSkills)],
    buzzwords: [...new Set(foundBuzzwords)],
    actionVerbs: [...new Set(foundVerbs)],
    allWords: words
  };
};

// Calculate keyword match percentage
const calculateKeywordMatch = (resumeKeywords, jdKeywords) => {
  if (!jdKeywords.length) return { percentage: 0, matched: [], missing: [] };
  
  const matched = [];
  const missing = [];
  
  jdKeywords.forEach(keyword => {
    if (resumeKeywords.includes(keyword.toLowerCase())) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  });
  
  const percentage = Math.round((matched.length / jdKeywords.length) * 100);
  
  return { percentage, matched, missing };
};

// Calculate skill overlap score
const calculateSkillOverlap = (resumeSkills, jdSkills) => {
  if (!jdSkills.length) return 0;
  
  const matched = resumeSkills.filter(skill => 
    jdSkills.some(jdSkill => jdSkill.toLowerCase() === skill.toLowerCase())
  );
  
  return Math.round((matched.length / jdSkills.length) * 100);
};

// Check for metrics/numbers in experience
const hasMetrics = (text) => {
  const metricPatterns = [
    /\d+%/,           // percentages
    /\$\d+/,          // dollar amounts
    /\d+\s*(k|K|m|M|million|billion)/,  // large numbers
    /\d+\s*(users|customers|clients)/i,  // user counts
    /\d+\s*(team|people|engineers)/i,   // team sizes
    /increased|decreased|improved|reduced|optimized/i  // improvement verbs
  ];
  
  return metricPatterns.some(pattern => pattern.test(text));
};

// Detect experience level from text
const detectExperienceLevel = (text) => {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('senior') || lowerText.includes('lead') || lowerText.includes('principal')) {
    return 'senior';
  } else if (lowerText.includes('mid') || lowerText.includes('intermediate')) {
    return 'mid';
  } else if (lowerText.includes('junior') || lowerText.includes('entry') || lowerText.includes('fresher')) {
    return 'entry';
  }
  
  return 'any';
};

// Calculate section scores
const calculateSectionScores = (resumeData, jdData) => {
  const scores = {
    skills: 0,
    experience: 0,
    projects: 0,
    education: 0
  };
  
  // Skills score based on keyword match
  if (jdData.requiredSkills && jdData.requiredSkills.length > 0) {
    const skillMatch = calculateSkillOverlap(
      resumeData.skills || [],
      jdData.requiredSkills
    );
    scores.skills = skillMatch;
  } else {
    scores.skills = resumeData.skills && resumeData.skills.length > 5 ? 70 : 40;
  }
  
  // Experience score
  if (resumeData.experience && resumeData.experience.length > 0) {
    let expScore = 50;
    
    // Check for metrics
    const hasExperienceMetrics = resumeData.experience.some(exp => 
      hasMetrics(exp.description || '')
    );
    if (hasExperienceMetrics) expScore += 20;
    
    // Check for action verbs
    const hasActionVerbs = resumeData.experience.some(exp => {
      const keywords = extractKeywords(exp.description || '');
      return keywords.actionVerbs.length > 0;
    });
    if (hasActionVerbs) expScore += 15;
    
    // Check experience level alignment
    const resumeExpLevel = detectExperienceLevel(JSON.stringify(resumeData.experience));
    const jdExpLevel = jdData.experienceLevel || 'any';
    
    if (resumeExpLevel === jdExpLevel || jdExpLevel === 'any') {
      expScore += 15;
    }
    
    scores.experience = Math.min(expScore, 100);
  } else {
    scores.experience = 20;
  }
  
  // Projects score
  if (resumeData.projects && resumeData.projects.length > 0) {
    let projScore = 50;
    
    // Check for technology mentions
    const hasTechStack = resumeData.projects.some(proj => 
      proj.technologies && proj.technologies.length > 0
    );
    if (hasTechStack) projScore += 20;
    
    // Check for descriptions
    const hasDescriptions = resumeData.projects.every(proj => 
      proj.description && proj.description.length > 50
    );
    if (hasDescriptions) projScore += 15;
    
    // Check for metrics in projects
    const hasProjectMetrics = resumeData.projects.some(proj => 
      hasMetrics(proj.description || '')
    );
    if (hasProjectMetrics) projScore += 15;
    
    scores.projects = Math.min(projScore, 100);
  } else {
    scores.projects = 30;
  }
  
  // Education score
  if (resumeData.education && resumeData.education.length > 0) {
    scores.education = 80;
    
    // Check for relevant degrees
    const hasRelevantDegree = resumeData.education.some(edu => {
      const degree = (edu.degree || '').toLowerCase();
      return degree.includes('computer') || 
             degree.includes('software') || 
             degree.includes('engineering') ||
             degree.includes('science') ||
             degree.includes('b.tech') ||
             degree.includes('m.tech') ||
             degree.includes('b.e') ||
             degree.includes('m.e');
    });
    
    if (hasRelevantDegree) scores.education = 95;
  } else {
    scores.education = 40;
  }
  
  return scores;
};

// Generate smart feedback
const generateFeedback = (resumeData, jdData, scores) => {
  const feedback = {
    missingSkills: [],
    weakSections: [],
    strongPoints: [],
    repeatedKeywords: [],
    overusedBuzzwords: [],
    suggestions: []
  };
  
  // Find missing skills
  if (jdData.requiredSkills && jdData.requiredSkills.length > 0) {
    const resumeSkills = (resumeData.skills || []).map(s => s.toLowerCase());
    feedback.missingSkills = jdData.requiredSkills.filter(skill => 
      !resumeSkills.includes(skill.toLowerCase())
    ).slice(0, 8);
  }
  
  // Identify weak sections
  if (scores.skills < 60) feedback.weakSections.push('Skills');
  if (scores.experience < 60) feedback.weakSections.push('Experience');
  if (scores.projects < 60) feedback.weakSections.push('Projects');
  if (scores.education < 60) feedback.weakSections.push('Education');
  
  // Identify strong points
  if (scores.skills >= 80) feedback.strongPoints.push('Strong technical skills match');
  if (scores.experience >= 80) feedback.strongPoints.push('Well-documented experience');
  if (scores.projects >= 80) feedback.strongPoints.push('Impressive projects section');
  if (scores.education >= 80) feedback.strongPoints.push('Relevant educational background');
  
  // Check for buzzwords
  const resumeText = JSON.stringify(resumeData).toLowerCase();
  BUZZWORDS.forEach(buzz => {
    const count = (resumeText.match(new RegExp(buzz, 'gi')) || []).length;
    if (count > 0) feedback.overusedBuzzwords.push(buzz);
  });
  
  // Check for repeated keywords
  const words = resumeText.match(/\b\w+\b/g) || [];
  const wordCounts = {};
  words.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });
  
  Object.entries(wordCounts).forEach(([word, count]) => {
    if (count > 5 && word.length > 3) {
      feedback.repeatedKeywords.push(word);
    }
  });
  
  // Generate suggestions
  if (feedback.missingSkills.length > 0) {
    feedback.suggestions.push(`Add these missing skills: ${feedback.missingSkills.slice(0, 5).join(', ')}`);
  }
  
  if (!hasMetrics(resumeText)) {
    feedback.suggestions.push('Add metrics to your experience (e.g., "Increased performance by 40%")');
  }
  
  if (feedback.overusedBuzzwords.length > 0) {
    feedback.suggestions.push('Replace generic terms with specific achievements');
  }
  
  if (!resumeData.projects || resumeData.projects.length === 0) {
    feedback.suggestions.push('Add personal projects to showcase your skills');
  }
  
  if (!resumeData.skills || resumeData.skills.length < 5) {
    feedback.suggestions.push('Expand your skills section with more technologies');
  }
  
 
  if (feedback.suggestions.length === 0) {
    feedback.suggestions.push('Your resume looks great! Consider adding more quantifiable achievements.');
  }
  
  return feedback;
};

// Main ATS analysis function
const analyzeResume = (resumeData, jdData = {}) => {
  // Extract keywords from resume
  const resumeKeywords = extractKeywords(JSON.stringify(resumeData));
  
   
  const jdKeywords = extractKeywords(JSON.stringify(jdData));
  
  // Calculate keyword match
  const keywordMatch = calculateKeywordMatch(
    resumeKeywords.allWords,
    jdKeywords.skills
  );
  
  // Calculate section scores
  const sectionScores = calculateSectionScores(resumeData, jdData);
  
 
  const overallScore = Math.round(
    (sectionScores.skills * 0.35) +
    (sectionScores.experience * 0.30) +
    (sectionScores.projects * 0.25) +
    (sectionScores.education * 0.10)
  );
  
   
  const feedback = generateFeedback(resumeData, jdData, sectionScores);
  
  return {
    overallScore,
    sectionScores,
    keywordMatch,
    feedback,
    resumeKeywords: {
      skills: resumeKeywords.skills,
      actionVerbs: resumeKeywords.actionVerbs
    }
  };
};

module.exports = {
  analyzeResume,
  extractKeywords,
  calculateKeywordMatch,
  TECH_SKILLS,
  BUZZWORDS,
  ACTION_VERBS
};

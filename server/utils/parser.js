const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Parse PDF file buffer to text
 */
const parsePDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return {
      text: data.text,
      pages: data.numpages,
      info: data.info
    };
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
};

/**
 * Parse DOCX file buffer to text
 */
const parseDOCX = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return {
      text: result.value,
      messages: result.messages
    };
  } catch (error) {
    throw new Error(`Failed to parse DOCX: ${error.message}`);
  }
};

/**
 * Extract sections from resume text
 * Uses pattern matching to identify different sections
 */
const extractSections = (text) => {
  const sections = {
    skills: [],
    experience: [],
    projects: [],
    education: []
  };
  
  const lowerText = text.toLowerCase();
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Find section boundaries
  let currentSection = null;
  let sectionContent = [];
  
  const sectionPatterns = {
    skills: /^(skills|technical skills|core competencies|technologies|tech stack)/i,
    experience: /^(experience|work experience|professional experience|employment|work history)/i,
    projects: /^(projects|personal projects|academic projects|key projects)/i,
    education: /^(education|academic background|qualifications|degrees)/i
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this line starts a new section
    let foundSection = null;
    for (const [sectionName, pattern] of Object.entries(sectionPatterns)) {
      if (pattern.test(line)) {
        foundSection = sectionName;
        break;
      }
    }
    
    if (foundSection) {
      // Save previous section content
      if (currentSection && sectionContent.length > 0) {
        sections[currentSection] = parseSectionContent(currentSection, sectionContent);
      }
      currentSection = foundSection;
      sectionContent = [];
    } else if (currentSection) {
      sectionContent.push(line);
    }
  }
  
  // Don't forget the last section
  if (currentSection && sectionContent.length > 0) {
    sections[currentSection] = parseSectionContent(currentSection, sectionContent);
  }
  
  // If no sections were found, try to infer from content
  if (sections.skills.length === 0) {
    sections.skills = extractSkillsFromText(text);
  }
  
  return sections;
};

/**
 * Parse content within a section based on section type
 */
const parseSectionContent = (sectionName, content) => {
  switch (sectionName) {
    case 'skills':
      return parseSkills(content);
    case 'experience':
      return parseExperience(content);
    case 'projects':
      return parseProjects(content);
    case 'education':
      return parseEducation(content);
    default:
      return content;
  }
};

/**
 * Parse skills section
 */
const parseSkills = (content) => {
  const skills = [];
  const text = content.join(' ');
  
  // Common delimiters for skills
  const delimiters = /[,|•\-·]+/;
  const parts = text.split(delimiters);
  
  parts.forEach(part => {
    const skill = part.trim();
    if (skill.length > 1 && skill.length < 50 && !isCommonWord(skill)) {
      skills.push(skill);
    }
  });
  
  return [...new Set(skills)];
};

/**
 * Parse experience section
 */
const parseExperience = (content) => {
  const experiences = [];
  let currentExp = null;
  
  const datePattern = /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*\d{4}|\d{4}\s*[-–]\s*(present|current|now|\d{4})/i;
  const titlePattern = /(developer|engineer|manager|analyst|designer|intern|consultant|lead|architect|specialist)/i;
  
  for (const line of content) {
    if (datePattern.test(line) || titlePattern.test(line)) {
      if (currentExp) {
        experiences.push(currentExp);
      }
      currentExp = {
        title: '',
        company: '',
        duration: '',
        description: ''
      };
      
      if (datePattern.test(line)) {
        currentExp.duration = line.match(datePattern)[0];
      }
      
      if (titlePattern.test(line)) {
        currentExp.title = line;
      }
    } else if (currentExp) {
      if (!currentExp.title && line.length < 100) {
        currentExp.title = line;
      } else if (!currentExp.company && line.length < 100) {
        currentExp.company = line;
      } else {
        currentExp.description += line + ' ';
      }
    }
  }
  
  if (currentExp) {
    experiences.push(currentExp);
  }
  
  return experiences.filter(exp => exp.title || exp.description);
};

/**
 * Parse projects section
 */
const parseProjects = (content) => {
  const projects = [];
  let currentProject = null;
  
  for (const line of content) {
    // Project names are often capitalized or have special formatting
    if (line.length < 80 && (line.includes(':') || /^[A-Z]/.test(line))) {
      if (currentProject) {
        projects.push(currentProject);
      }
      currentProject = {
        name: line.replace(':', '').trim(),
        description: '',
        technologies: []
      };
    } else if (currentProject) {
      // Extract technologies mentioned
      const techWords = ['react', 'node', 'python', 'javascript', 'java', 'angular', 'vue', 
                        'mongodb', 'sql', 'aws', 'docker', 'kubernetes', 'typescript'];
      
      techWords.forEach(tech => {
        if (line.toLowerCase().includes(tech) && !currentProject.technologies.includes(tech)) {
          currentProject.technologies.push(tech);
        }
      });
      
      currentProject.description += line + ' ';
    }
  }
  
  if (currentProject) {
    projects.push(currentProject);
  }
  
  return projects.filter(proj => proj.name);
};

/**
 * Parse education section
 */
const parseEducation = (content) => {
  const educations = [];
  let currentEdu = null;
  
  const degreePattern = /(b\.|m\.|phd|bachelor|master|doctorate|degree|diploma|certification)/i;
  const yearPattern = /\d{4}/;
  
  for (const line of content) {
    if (degreePattern.test(line) || yearPattern.test(line)) {
      if (currentEdu) {
        educations.push(currentEdu);
      }
      currentEdu = {
        degree: '',
        institution: '',
        year: ''
      };
      
      if (degreePattern.test(line)) {
        currentEdu.degree = line;
      }
      
      const yearMatch = line.match(yearPattern);
      if (yearMatch) {
        currentEdu.year = yearMatch[0];
      }
    } else if (currentEdu) {
      if (!currentEdu.institution && line.length < 100) {
        currentEdu.institution = line;
      } else if (!currentEdu.degree) {
        currentEdu.degree = line;
      }
    }
  }
  
  if (currentEdu) {
    educations.push(currentEdu);
  }
  
  return educations.filter(edu => edu.degree || edu.institution);
};

/**
 * Extract skills from full text when no skills section is found
 */
const extractSkillsFromText = (text) => {
  const commonSkills = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'ruby', 'php',
    'react', 'vue', 'angular', 'svelte', 'nextjs', 'node', 'express',
    'html', 'css', 'sass', 'tailwind', 'bootstrap',
    'mongodb', 'mysql', 'postgresql', 'sqlite', 'redis',
    'aws', 'azure', 'gcp', 'firebase',
    'docker', 'kubernetes', 'jenkins',
    'git', 'github', 'gitlab',
    'rest', 'graphql', 'api'
  ];
  
  const foundSkills = [];
  const lowerText = text.toLowerCase();
  
  commonSkills.forEach(skill => {
    if (lowerText.includes(skill)) {
      foundSkills.push(skill);
    }
  });
  
  return [...new Set(foundSkills)];
};

/**
 * Check if a word is too common to be a skill
 */
const isCommonWord = (word) => {
  const commonWords = [
    'and', 'or', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'have', 'has',
    'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might'
  ];
  
  return commonWords.includes(word.toLowerCase());
};

/**
 * Extract job description data
 */
const extractJDData = (text) => {
  const lowerText = text.toLowerCase();
  
  // Extract required skills
  const requiredSkills = [];
  const skillPatterns = [
    /required skills?:?\s*([^\n]+)/i,
    /qualifications?:?\s*([^\n]+)/i,
    /requirements?:?\s*([^\n]+)/i
  ];
  
  skillPatterns.forEach(pattern => {
    const match = text.match(pattern);
    if (match) {
      const skills = match[1].split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0);
      requiredSkills.push(...skills);
    }
  });
  
  // Detect experience level
  let experienceLevel = 'any';
  if (lowerText.includes('senior') || lowerText.includes('5+') || lowerText.includes('5-8')) {
    experienceLevel = 'senior';
  } else if (lowerText.includes('mid') || lowerText.includes('2-5') || lowerText.includes('3+')) {
    experienceLevel = 'mid';
  } else if (lowerText.includes('junior') || lowerText.includes('entry') || lowerText.includes('0-2') || lowerText.includes('fresher')) {
    experienceLevel = 'entry';
  }
  
  // Detect role type
  let roleType = 'any';
  if (lowerText.includes('full-time') || lowerText.includes('full time')) {
    roleType = 'full-time';
  } else if (lowerText.includes('part-time') || lowerText.includes('part time')) {
    roleType = 'part-time';
  } else if (lowerText.includes('contract')) {
    roleType = 'contract';
  } else if (lowerText.includes('internship') || lowerText.includes('intern')) {
    roleType = 'internship';
  }
  
  // Extract all keywords
  const keywords = extractKeywordsFromJD(text);
  
  return {
    requiredSkills: [...new Set(requiredSkills)],
    preferredSkills: [],
    experienceLevel,
    roleType,
    keywords,
    responsibilities: extractResponsibilities(text)
  };
};

/**
 * Extract keywords from job description
 */
const extractKeywordsFromJD = (text) => {
  const keywords = [];
  const techSkills = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust',
    'react', 'vue', 'angular', 'node', 'express', 'nextjs',
    'html', 'css', 'tailwind', 'bootstrap',
    'mongodb', 'mysql', 'postgresql', 'redis',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes',
    'git', 'rest', 'graphql', 'api'
  ];
  
  const lowerText = text.toLowerCase();
  
  techSkills.forEach(skill => {
    if (lowerText.includes(skill)) {
      keywords.push(skill);
    }
  });
  
  return [...new Set(keywords)];
};

/**
 * Extract responsibilities from job description
 */
const extractResponsibilities = (text) => {
  const responsibilities = [];
  const respPattern = /responsibilities?:?\s*([^\n]+(?:\n[^\n]+)*)/i;
  const match = text.match(respPattern);
  
  if (match) {
    const respText = match[1];
    const lines = respText.split('\n').filter(line => line.trim().length > 0);
    responsibilities.push(...lines.slice(0, 5));
  }
  
  return responsibilities;
};

module.exports = {
  parsePDF,
  parseDOCX,
  extractSections,
  extractJDData
};

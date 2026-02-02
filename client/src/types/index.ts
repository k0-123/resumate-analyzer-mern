// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  resumeHistory: string[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Resume types
export interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface ExtractedSections {
  skills: string[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
}

export interface Resume {
  _id: string;
  user: string;
  originalName: string;
  fileType: 'pdf' | 'docx';
  extractedSections: ExtractedSections;
  analysisResults: AnalysisResult[];
  version: number;
  createdAt: string;
  updatedAt: string;
}

// Analysis types
export interface SectionScores {
  skills: number;
  experience: number;
  projects: number;
  education: number;
}

export interface KeywordMatch {
  matched: string[];
  missing: string[];
  percentage: number;
}

export interface Feedback {
  missingSkills: string[];
  weakSections: string[];
  strongPoints: string[];
  repeatedKeywords: string[];
  overusedBuzzwords: string[];
  suggestions: string[];
}

export interface AnalysisResult {
  _id?: string;
  overallScore: number;
  sectionScores: SectionScores;
  keywordMatch: KeywordMatch;
  feedback: Feedback;
  resumeKeywords: {
    skills: string[];
    actionVerbs: string[];
  };
  analyzedAt: string;
  jobDescription?: string;
}

// Job Description types
export interface JobDescription {
  _id: string;
  user: string;
  title: string;
  company: string;
  extractedData: {
    requiredSkills: string[];
    preferredSkills: string[];
    experienceLevel: 'entry' | 'mid' | 'senior' | 'any';
    roleType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'any';
    keywords: string[];
    responsibilities: string[];
  };
  createdAt: string;
}

// Dashboard types
export interface DashboardStats {
  totalResumes: number;
  totalAnalyses: number;
  averageScore: number;
  improvementTrend: number;
  recentAnalyses: {
    date: string;
    score: number;
    resumeName: string;
  }[];
  scoreHistory: {
    date: string;
    score: number;
    resumeName: string;
  }[];
}

// UI types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

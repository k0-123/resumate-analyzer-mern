const mongoose = require('mongoose');

const analysisResultSchema = new mongoose.Schema({
  overallScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  sectionScores: {
    skills: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    education: { type: Number, default: 0 }
  },
  keywordMatch: {
    matched: [String],
    missing: [String],
    percentage: Number
  },
  feedback: {
    missingSkills: [String],
    weakSections: [String],
    strongPoints: [String],
    repeatedKeywords: [String],
    overusedBuzzwords: [String],
    suggestions: [String]
  },
  jobDescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobDescription'
  },
  analyzedAt: {
    type: Date,
    default: Date.now
  }
});

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pdf', 'docx'],
    required: true
  },
  rawText: {
    type: String,
    required: true
  },
  extractedSections: {
    skills: [String],
    experience: [{
      title: String,
      company: String,
      duration: String,
      description: String
    }],
    projects: [{
      name: String,
      description: String,
      technologies: [String]
    }],
    education: [{
      degree: String,
      institution: String,
      year: String
    }]
  },
  analysisResults: [analysisResultSchema],
  version: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', resumeSchema);

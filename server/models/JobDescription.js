const mongoose = require('mongoose');

const jobDescriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  rawText: {
    type: String,
    required: true
  },
  extractedData: {
    requiredSkills: [String],
    preferredSkills: [String],
    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'any'],
      default: 'any'
    },
    roleType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'any'],
      default: 'any'
    },
    keywords: [String],
    responsibilities: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JobDescription', jobDescriptionSchema);

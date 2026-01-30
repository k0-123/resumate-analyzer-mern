const express = require('express');
const Resume = require('../models/Resume');
const JobDescription = require('../models/JobDescription');
const { protect } = require('../middleware/auth');
const { analyzeResume } = require('../utils/atsEngine');
const { extractJDData } = require('../utils/parser');

const router = express.Router();


router.post('/resume/:resumeId', protect, async (req, res) => {
  try {
    const { resumeId } = req.params;

     
    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
 
    const analysisResult = analyzeResume(resume.extractedSections, {});
 
    resume.analysisResults.push(analysisResult);
    await resume.save();

    res.json({
      success: true,
      message: 'Resume analyzed successfully',
      data: {
        resumeId: resume._id,
        ...analysisResult
      }
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

 
router.post('/compare', protect, async (req, res) => {
  try {
    const { resumeId, jdText, jdId } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: 'Resume ID is required'
      });
    }

   
    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    let jdData = {};
    let jobDescription = null;
 
    if (jdId) {
      jobDescription = await JobDescription.findOne({
        _id: jdId,
        user: req.user._id
      });
      
      if (jobDescription) {
        jdData = jobDescription.extractedData;
      }
    } else if (jdText) {
   
      jdData = extractJDData(jdText);
      
       
      jobDescription = await JobDescription.create({
        user: req.user._id,
        title: 'Untitled Job Description',
        rawText: jdText,
        extractedData: jdData
      });
    }

     
    const analysisResult = analyzeResume(resume.extractedSections, jdData);
 
    if (jobDescription) {
      analysisResult.jobDescription = jobDescription._id;
    }
 
    resume.analysisResults.push(analysisResult);
    await resume.save();

    res.json({
      success: true,
      message: 'Resume compared with job description successfully',
      data: {
        resumeId: resume._id,
        jobDescriptionId: jobDescription?._id,
        ...analysisResult
      }
    });
  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

 
router.post('/jd', protect, async (req, res) => {
  try {
    const { title, company, rawText } = req.body;

    if (!rawText) {
      return res.status(400).json({
        success: false,
        message: 'Job description text is required'
      });
    }

    
    const extractedData = extractJDData(rawText);

    // Create JD document
    const jobDescription = await JobDescription.create({
      user: req.user._id,
      title: title || 'Untitled Job Description',
      company: company || '',
      rawText,
      extractedData
    });

    res.status(201).json({
      success: true,
      message: 'Job description saved and analyzed',
      data: {
        jdId: jobDescription._id,
        title: jobDescription.title,
        company: jobDescription.company,
        extractedData: jobDescription.extractedData
      }
    });
  } catch (error) {
    console.error('JD analysis error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

 
router.get('/jd', protect, async (req, res) => {
  try {
    const jds = await JobDescription.find({ user: req.user._id })
      .select('-rawText')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: jds.length,
      data: jds
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

 
router.get('/jd/:id', protect, async (req, res) => {
  try {
    const jd = await JobDescription.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!jd) {
      return res.status(404).json({
        success: false,
        message: 'Job description not found'
      });
    }

    res.json({
      success: true,
      data: jd
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

 
router.delete('/jd/:id', protect, async (req, res) => {
  try {
    const jd = await JobDescription.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!jd) {
      return res.status(404).json({
        success: false,
        message: 'Job description not found'
      });
    }

    res.json({
      success: true,
      message: 'Job description deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

 
router.get('/dashboard', protect, async (req, res) => {
  try {
    // Get all resumes with analysis results
    const resumes = await Resume.find({ user: req.user._id })
      .select('analysisResults createdAt originalName');
 
    const totalResumes = resumes.length;
    const totalAnalyses = resumes.reduce((sum, r) => sum + r.analysisResults.length, 0);
    
     
    let totalScore = 0;
    let scoreCount = 0;
    const scoreHistory = [];
    
    resumes.forEach(resume => {
      resume.analysisResults.forEach(analysis => {
        totalScore += analysis.overallScore;
        scoreCount++;
        scoreHistory.push({
          date: analysis.analyzedAt,
          score: analysis.overallScore,
          resumeName: resume.originalName
        });
      });
    });

    const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;

    
    const recentAnalyses = scoreHistory
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

     
    const improvementTrend = scoreHistory.length > 1 
      ? scoreHistory[scoreHistory.length - 1].score - scoreHistory[0].score
      : 0;

    res.json({
      success: true,
      data: {
        totalResumes,
        totalAnalyses,
        averageScore,
        improvementTrend,
        recentAnalyses,
        scoreHistory: scoreHistory.slice(-10)  }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

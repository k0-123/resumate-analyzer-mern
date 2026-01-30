 const express = require('express');
const Resume = require('../models/Resume');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const { parsePDF, parseDOCX, extractSections } = require('../utils/parser');

const router = express.Router();

 
router.post('/upload', protect, upload.single('resume'), handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const { originalname, mimetype, buffer } = req.file;
    const fileExt = originalname.split('.').pop().toLowerCase();
    
    let parsedData;
    let fileType;

  
    if (fileExt === 'pdf') {
      parsedData = await parsePDF(buffer);
      fileType = 'pdf';
    } else if (fileExt === 'docx' || fileExt === 'doc') {
      parsedData = await parseDOCX(buffer);
      fileType = 'docx';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Unsupported file format. Please upload PDF or DOCX.'
      });
    }

     
    const extractedSections = extractSections(parsedData.text);

     
    const resume = await Resume.create({
      user: req.user._id,
      originalName: originalname,
      fileType,
      rawText: parsedData.text,
      extractedSections,
      version: 1
    });
 
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { resumeHistory: resume._id } }
    );

    res.status(201).json({
      success: true,
      message: 'Resume uploaded and parsed successfully',
      data: {
        resumeId: resume._id,
        originalName: resume.originalName,
        fileType: resume.fileType,
        extractedSections: resume.extractedSections,
        createdAt: resume.createdAt
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

 
router.get('/', protect, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .select('-rawText')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: resumes.length,
      data: resumes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

 
router.get('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    res.json({
      success: true,
      data: resume
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

 
router.delete('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

   
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { resumeHistory: req.params.id } }
    );

    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

 
router.get('/:id/analysis', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    }).select('analysisResults');

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    res.json({
      success: true,
      count: resume.analysisResults.length,
      data: resume.analysisResults
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

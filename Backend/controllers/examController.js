const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Submission = require('../models/Submission');

// @desc    Create a new exam (Admin only)
// @route   POST /api/exams
// @access  Private (Admin)
const createExam = async (req, res) => {
  try {
    const { title, description, duration, passMarks } = req.body;

    if (!title || !duration || passMarks === undefined) {
      return res.status(400).json({
        message: 'Please provide title, duration, and passMarks'
      });
    }

    const exam = await Exam.create({
      title,
      description,
      duration,
      passMarks,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, data: exam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add questions to an exam (Admin only)
// @route   POST /api/exams/:id/questions
// @access  Private (Admin)
const addQuestions = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Expecting an array of questions: [{ questionText, options, correctOptionIndex, points }]
    const { questions } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of questions' });
    }

    let addedPoints = 0;
    const questionsToInsert = questions.map((q) => {
      const points = q.points || 1;
      addedPoints += points;
      return {
        examId: exam._id,
        questionText: q.questionText,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
        points
      };
    });

    const savedQuestions = await Question.insertMany(questionsToInsert);

    // Update totalMarks on the exam
    exam.totalMarks += addedPoints;
    await exam.save();

    res.status(201).json({
      success: true,
      count: savedQuestions.length,
      data: savedQuestions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Publish / Unpublish an exam (Admin only)
// @route   PATCH /api/exams/:id/publish
// @access  Private (Admin)
const togglePublishExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    exam.isPublished = !exam.isPublished;
    await exam.save();

    res.status(200).json({
      success: true,
      message: `Exam ${exam.isPublished ? 'published' : 'unpublished'} successfully`,
      data: exam
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get published exams (Students & Admin)
// @route   GET /api/exams
// @access  
// @desc    Get exams with search, published filtering, and pagination (Rule 12)
// @route   GET /api/exams?search=keyword&page=1&limit=10
// @access  Private
const getExams = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    // Search query by title or description
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Role-based visibility
    if (req.user.role !== 'admin') {
      query.isPublished = true;
    }

    const totalRecords = await Exam.countDocuments(query);
    const exams = await Exam.find(query)
      .populate('createdBy', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: 'Exams retrieved successfully',
      data: {
        exams,
        pagination: {
          totalRecords,
          totalPages: Math.ceil(totalRecords / limit),
          currentPage: page,
          limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// @desc    Get complete exam results & student analytics (Admin only)
// @route   GET /api/exams/:examId/results
// @access  Private (Admin)
const getExamAnalytics = async (req, res) => {
  try {
    const { examId } = req.params;

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Retrieve all completed or submitted attempts for this exam
    const submissions = await Submission.find({ examId })
      .populate('studentId', 'name email')
      .sort('-submittedAt');

    const totalSubmissions = submissions.length;

    // Calculate aggregated metrics
    let totalScoreSum = 0;
    let totalPassed = 0;

    const studentResults = submissions.map((sub) => {
      totalScoreSum += sub.score;
      if (sub.passed) totalPassed += 1;

      return {
        submissionId: sub._id,
        student: {
          id: sub.studentId?._id,
          name: sub.studentId?.name || 'Unknown',
          email: sub.studentId?.email || 'N/A'
        },
        score: sub.score,
        totalMarks: sub.totalMarks,
        passed: sub.passed,
        status: sub.status,
        startedAt: sub.startedAt,
        submittedAt: sub.submittedAt
      };
    });

    const averageScore = totalSubmissions > 0 ? (totalScoreSum / totalSubmissions).toFixed(2) : 0;
    const passRate = totalSubmissions > 0 ? `${((totalPassed / totalSubmissions) * 100).toFixed(1)}%` : '0%';

    res.status(200).json({
      success: true,
      data: {
        exam: {
          id: exam._id,
          title: exam.title,
          totalMarks: exam.totalMarks,
          passMarks: exam.passMarks
        },
        analytics: {
          totalAttempts: totalSubmissions,
          passedCount: totalPassed,
          failedCount: totalSubmissions - totalPassed,
          passRate,
          averageScore: Number(averageScore)
        },
        submissions: studentResults
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createExam,
  addQuestions,
  togglePublishExam,
  getExams,
  getExamAnalytics
};
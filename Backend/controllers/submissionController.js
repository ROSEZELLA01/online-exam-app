const Submission = require('../models/Submission');
const Exam = require('../models/Exam');
const Question = require('../models/Question');

// @desc    Start an exam attempt (Student)
// @route   POST /api/submissions/:examId/start
// @access  Private (Student)
const startExam = async (req, res) => {
  try {
    const { examId } = req.params;

    const exam = await Exam.findById(examId);
    if (!exam || !exam.isPublished) {
      return res.status(404).json({ message: 'Exam is unavailable or not published' });
    }

    // Check if the student already has an active or completed attempt
    const existingSubmission = await Submission.findOne({
      examId,
      studentId: req.user._id
    });

    if (existingSubmission) {
      return res.status(400).json({
        message: 'Exam already attempted or currently in progress',
        submissionId: existingSubmission._id,
        status: existingSubmission.status
      });
    }

    // Fetch questions without leaking the correct answer index to the frontend
    const questions = await Question.find({ examId }).select('-correctOptionIndex');

    if (questions.length === 0) {
      return res.status(400).json({ message: 'Exam has no questions' });
    }

    const submission = await Submission.create({
      examId,
      studentId: req.user._id,
      totalMarks: exam.totalMarks,
      answers: []
    });

    res.status(201).json({
      success: true,
      submissionId: submission._id,
      startedAt: submission.startedAt,
      durationMinutes: exam.duration,
      questions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Grade & finalize exam submission by examId (Student)
// @route   POST /api/submissions/:examId/submit
// @access  Private (Student)
const submitExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { answers } = req.body; // Array format: [{ questionId, selectedOptionIndex }]

    // Locate the student's in-progress attempt using JWT user ID and examId
    const submission = await Submission.findOne({
      examId,
      studentId: req.user._id,
      status: 'in-progress'
    });

    if (!submission) {
      return res.status(404).json({
        message: 'No active exam attempt found for this exam'
      });
    }

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const now = new Date();

    // Server-side timing check: exam duration + 2-minute latency buffer
    const allowedDurationMs = (exam.duration + 2) * 60 * 1000;
    const elapsedMs = now.getTime() - new Date(submission.startedAt).getTime();
    const isTimedOut = elapsedMs > allowedDurationMs;

    // Load original questions with correctOptionIndex from the database for grading
    const questions = await Question.find({ examId });
    const questionMap = new Map();
    questions.forEach((q) => questionMap.set(q._id.toString(), q));

    let finalScore = 0;
    const gradedAnswers = (answers || []).map((ans) => {
      const q = questionMap.get(ans.questionId);
      if (!q) return null;

      const isCorrect = q.correctOptionIndex === ans.selectedOptionIndex;
      const pointsAwarded = isCorrect ? q.points : 0;
      finalScore += pointsAwarded;

      return {
        questionId: q._id,
        selectedOptionIndex: ans.selectedOptionIndex,
        isCorrect,
        pointsAwarded
      };
    }).filter(Boolean);

    submission.answers = gradedAnswers;
    submission.score = finalScore;
    submission.submittedAt = now;
    submission.passed = finalScore >= exam.passMarks;
    submission.status = isTimedOut ? 'timed-out' : 'submitted';

    await submission.save();

    res.status(200).json({
      success: true,
      message: isTimedOut ? 'Exam submitted past deadline (timed-out)' : 'Exam submitted successfully',
      result: {
        submissionId: submission._id,
        score: submission.score,
        totalMarks: exam.totalMarks,
        passMarks: exam.passMarks,
        passed: submission.passed,
        status: submission.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get detailed submission results (Student or Admin)
// @route   GET /api/submissions/:submissionId
// @access  Private
const getSubmissionResult = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.submissionId)
      .populate('examId', 'title description duration totalMarks passMarks')
      .populate('studentId', 'name email');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Access check: only the student who took it or an admin can view results
    const isOwner = submission.studentId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view these results' });
    }

    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  startExam,
  submitExam,
  getSubmissionResult
};
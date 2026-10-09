const Submission = require('../models/Submission');
const Exam = require('../models/Exam');
const Question = require('../models/Question');


// @desc    Start or resume an exam attempt
// @route   POST /api/submissions/:examId/start
// @access  Private (Student)
const startExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const studentId = req.user._id;

    const exam = await Exam.findById(examId);
    if (!exam || !exam.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found or not currently available',
        data: null
      });
    }

    // Helper to safely format questions without exposing correctOptionIndex
    const formatQuestions = (questionList) => {
      if (!Array.isArray(questionList)) return [];
      return questionList.map((q) => ({
        _id: q._id,
        examId: exam._id,
        questionText: q.questionText,
        options: q.options || [],
        points: q.points || 1
      }));
    };

    // If questions are embedded on the exam document, use them; otherwise query Question model if applicable
    let examQuestions = [];
    if (Array.isArray(exam.questions)) {
      examQuestions = formatQuestions(exam.questions);
    } else {
      // If Question is a separate model in your codebase:
      try {
        const Question = require('../models/Question'); // Adjust path if needed
        const questionsFromDb = await Question.find({ examId });
        examQuestions = formatQuestions(questionsFromDb);
      } catch (e) {
        examQuestions = [];
      }
    }

    // Check for existing submissions
    let existingSubmission = await Submission.findOne({ examId, studentId });

    if (existingSubmission) {
      // If already submitted, prevent restart
      if (existingSubmission.status === 'submitted') {
        return res.status(400).json({
          success: false,
          message: 'Exam already submitted. Retakes are not permitted.',
          data: null
        });
      }

      // If in-progress, check if time has elapsed
      if (existingSubmission.status === 'in-progress') {
        const examDurationMs = (exam.duration || 30) * 60 * 1000;
        const timeElapsed = Date.now() - new Date(existingSubmission.startedAt).getTime();

        if (timeElapsed > examDurationMs) {
          existingSubmission.status = 'submitted';
          existingSubmission.submittedAt = new Date(
            new Date(existingSubmission.startedAt).getTime() + examDurationMs
          );
          existingSubmission.score = existingSubmission.score || 0;
          existingSubmission.passed = existingSubmission.score >= (exam.passMarks || 0);
          await existingSubmission.save();

          return res.status(400).json({
            success: false,
            message: 'Your previous exam attempt expired and has been automatically submitted.',
            data: null
          });
        }

        // Resuming within time limit
        const remainingSeconds = Math.max(
          0,
          Math.floor((examDurationMs - timeElapsed) / 1000)
        );

        return res.status(200).json({
          success: true,
          message: 'Resuming existing in-progress exam attempt',
          data: {
            submissionId: existingSubmission._id,
            startedAt: existingSubmission.startedAt,
            durationMinutes: exam.duration,
            remainingSeconds,
            questions: examQuestions
          }
        });
      }
    }

    // Create fresh attempt
    const newSubmission = await Submission.create({
      examId,
      studentId,
      startedAt: new Date(),
      status: 'in-progress',
      answers: [],
      score: 0,
      totalMarks: exam.totalMarks || 0
    });

    res.status(201).json({
      success: true,
      message: 'Exam started successfully',
      data: {
        submissionId: newSubmission._id,
        startedAt: newSubmission.startedAt,
        durationMinutes: exam.duration,
        questions: examQuestions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};


// @desc    Submit an exam attempt and grade answers
// @route   POST /api/submissions/:examId/submit
// @access  Private (Student)
const submitExam = async (req, res) => {
  try {
    const paramId = req.params.examId; // Could be examId OR submissionId depending on frontend
    const studentId = req.user._id;
    const { answers = [] } = req.body;

    // 1. Try finding by examId first, or by submissionId if that's what was passed
    let submission = await Submission.findOne({
      studentId,
      $or: [{ examId: paramId }, { _id: paramId }]
    }).sort('-startedAt');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'No submission record found for this exam or submission ID',
        data: null
      });
    }

    // 2. Fetch the exam record using submission.examId
    const exam = await Exam.findById(submission.examId);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Associated exam not found',
        data: null
      });
    }

    // 3. Resolve questions list (embedded or separate Question model)
    let questionsList = [];
    if (Array.isArray(exam.questions) && exam.questions.length > 0) {
      questionsList = exam.questions;
    } else {
      try {
        const Question = require('../models/Question');
        questionsList = await Question.find({ examId: exam._id });
      } catch (e) {
        questionsList = [];
      }
    }

    // 4. Calculate total marks available
    const totalExamMarks =
      exam.totalMarks ||
      questionsList.reduce((acc, q) => acc + (q.points || 1), 0);

    // 5. Grade the submitted answers
    let totalScore = 0;
    const gradedAnswers = answers.map((ans) => {
      const question = questionsList.find(
        (q) => q._id.toString() === ans.questionId?.toString()
      );

      let isCorrect = false;
      let pointsAwarded = 0;

      if (question && question.correctOptionIndex === ans.selectedOptionIndex) {
        isCorrect = true;
        pointsAwarded = question.points || 1;
        totalScore += pointsAwarded;
      }

      return {
        questionId: ans.questionId,
        selectedOptionIndex: ans.selectedOptionIndex,
        isCorrect,
        pointsAwarded
      };
    });

    // 6. Update and finalize submission
    submission.answers = gradedAnswers;
    submission.score = totalScore;
    submission.totalMarks = totalExamMarks;
    submission.passed = totalScore >= (exam.passMarks || 0);
    submission.status = 'submitted';
    submission.submittedAt = new Date();

    await submission.save();

    // 7. Return graded scorecard
    res.status(200).json({
      success: true,
      message: 'Exam submitted successfully',
      data: {
        submissionId: submission._id,
        score: submission.score,
        totalMarks: submission.totalMarks,
        passMarks: exam.passMarks || 0,
        passed: submission.passed,
        status: submission.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
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

// @desc    Get all exam submissions for the authenticated student
// @route   GET /api/submissions/mine
// @access  Private (Student)
const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ studentId: req.user._id })
      .populate('examId', 'title description duration totalMarks passMarks');

    // Auto-resolve any abandoned in-progress attempts
    const now = Date.now();
    for (let sub of submissions) {
      if (sub.status === 'in-progress' && sub.examId) {
        const durationMs = (sub.examId.duration || 30) * 60 * 1000;
        const elapsed = now - new Date(sub.startedAt).getTime();
        if (elapsed > durationMs) {
          sub.status = 'submitted';
          sub.submittedAt = new Date(new Date(sub.startedAt).getTime() + durationMs);
          sub.score = sub.score || 0;
          sub.passed = sub.score >= (sub.examId.passMarks || 0);
          await sub.save();
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Student submissions retrieved successfully',
      data: submissions.map((sub) => ({
        submissionId: sub._id,
        examId: sub.examId?._id || sub.examId,
        examTitle: sub.examId?.title || 'Unknown Exam',
        score: sub.score,
        totalMarks: sub.totalMarks,
        passMarks: sub.examId?.passMarks || 0,
        passed: sub.passed,
        status: sub.status,
        startedAt: sub.startedAt,
        submittedAt: sub.submittedAt
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

module.exports = {
  startExam,
  submitExam,
  getSubmissionResult,
  getMySubmissions
};
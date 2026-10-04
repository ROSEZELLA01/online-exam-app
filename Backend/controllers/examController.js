const Exam = require('../models/Exam');
const Question = require('../models/Question');

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
// @access  Private
const getExams = async (req, res) => {
  try {
    // Admins see all exams; students only see published ones
    const filter = req.user.role === 'admin' ? {} : { isPublished: true };
    const exams = await Exam.find(filter).populate('createdBy', 'name email').sort('-createdAt');

    res.status(200).json({ success: true, count: exams.length, data: exams });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createExam,
  addQuestions,
  togglePublishExam,
  getExams
};
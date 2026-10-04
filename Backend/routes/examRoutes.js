const express = require('express');
const {
  createExam,
  addQuestions,
  togglePublishExam,
  getExams,
    getExamAnalytics
} = require('../controllers/examController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getExams);
router.post('/', protect, authorize('admin'), createExam);
router.post('/:id/questions', protect, authorize('admin'), addQuestions);
router.patch('/:id/publish', protect, authorize('admin'), togglePublishExam);
router.get('/:examId/results', protect, authorize('admin'), getExamAnalytics);

module.exports = router;
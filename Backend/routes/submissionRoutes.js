const express = require('express');
const {
  startExam,
  submitExam,
  getSubmissionResult,getMySubmissions
} = require('../controllers/submissionController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/mine', protect, authorize('student'), getMySubmissions);
router.post('/:examId/start', protect, authorize('student'), startExam);
router.post('/:examId/submit', protect, authorize('student'), submitExam);
router.get('/:submissionId', protect, getSubmissionResult);

module.exports = router;
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
      index: true
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    submittedAt: {
      type: Date
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
          required: true
        },
        selectedOptionIndex: {
          type: Number,
          default: null
        },
        isCorrect: {
          type: Boolean,
          default: false
        },
        pointsAwarded: {
          type: Number,
          default: 0
        }
      }
    ],
    score: {
      type: Number,
      default: 0
    },
    totalMarks: {
      type: Number,
      default: 0
    },
    passed: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['in-progress', 'submitted', 'timed-out'],
      default: 'in-progress'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', submissionSchema);
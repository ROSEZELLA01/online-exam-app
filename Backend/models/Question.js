const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: [true, 'Question must belong to an exam'],
      index: true
    },
    questionText: {
      type: String,
      required: [true, 'Please enter the question text'],
      trim: true
    },
    options: {
      type: [
        {
          type: String,
          required: true,
          trim: true
        }
      ],
      validate: [
        (val) => val.length >= 2,
        'A question must have at least 2 options'
      ]
    },
    // Index of the correct option in the options array (e.g. 0 for option A)
    correctOptionIndex: {
      type: Number,
      required: [true, 'Please specify the correct option index'],
      min: 0
    },
    points: {
      type: Number,
      default: 1,
      min: [1, 'Points must be at least 1']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
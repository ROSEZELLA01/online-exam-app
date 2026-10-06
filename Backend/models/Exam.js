const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an exam title'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    duration: {
      type: Number,
      required: [true, 'Please specify the exam duration in minutes'],
      min: [1, 'Duration must be at least 1 minute']
    },
    totalMarks: {
      type: Number,
      default: 0
    },
    passMarks: {
      type: Number,
      required: [true, 'Please specify passing marks'],
      default: 0
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exam', examSchema);
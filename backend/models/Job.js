const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a job title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a job description'],
    },
    requirements: [{
      type: String,
    }],
    salary: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    experienceLevel: {
      type: String,
      required: true,
    },
    positions: {
      type: Number,
      required: true,
    },
    workMode: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site'],
      default: 'On-site'
    },
    applicationDeadline: {
      type: Date
    },
    status: {
      type: String,
      enum: ['Open', 'Closed'],
      default: 'Open'
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);

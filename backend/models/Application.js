const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'],
      default: 'Applied',
    },
    statusHistory: [
      {
        status: { type: String },
        updatedAt: { type: Date, default: Date.now },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
      }
    ],
    interviewDetails: {
      interviewDate: { type: Date },
      interviewMode: { type: String, enum: ['Online', 'Offline'] },
      meetingLink: { type: String },
      notes: { type: String }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);

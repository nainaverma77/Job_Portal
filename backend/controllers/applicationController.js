const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/v1/application/apply/:id
// @access  Private (Student)
const applyJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({ message: "Job id is required.", success: false });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job.", success: false });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found.", success: false });
    }

    // Create application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication._id);
    await job.save();

    return res.status(201).json({
      message: "Job applied successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// @desc    Get all applied jobs for current user
// @route   GET /api/v1/application/get
// @access  Private (Student)
const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    const applications = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
      path: 'job',
      options: { sort: { createdAt: -1 } },
      populate: {
        path: 'company',
        options: { sort: { createdAt: -1 } },
      }
    });

    if (!applications) {
      return res.status(404).json({ message: "No Applications found.", success: false });
    }

    return res.status(200).json({ applications, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// @desc    Get all applicants for a specific job (Recruiter)
// @route   GET /api/v1/application/:id/applicants
// @access  Private (Recruiter)
const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: 'applications',
      options: { sort: { createdAt: -1 } },
      populate: {
        path: 'applicant',
      }
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found.", success: false });
    }

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// @desc    Update application status (Recruiter)
// @route   POST /api/v1/application/status/:id/update
// @access  Private (Recruiter)
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res.status(400).json({ message: "Status is required.", success: false });
    }

    // Find the application by ID
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({ message: "Application not found.", success: false });
    }

    // Update status
    application.status = status;
    application.statusHistory.push({
      status: status,
      updatedAt: Date.now(),
      updatedBy: req.user._id
    });
    
    // Check if interview details are provided
    if (req.body.interviewDetails) {
       application.interviewDetails = req.body.interviewDetails;
    }

    await application.save();

    return res.status(200).json({
      message: "Status updated successfully.",
      success: true,
      application
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

module.exports = {
  applyJob,
  getAppliedJobs,
  getApplicants,
  updateStatus,
};

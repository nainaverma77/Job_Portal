const Job = require('../models/Job');

// @desc    Post a new job
// @route   POST /api/v1/job/post
// @access  Private (Recruiter)
const postJob = async (req, res) => {
  try {
    const { title, description, requirements, salary, location, jobType, experience, positions, companyId } = req.body;
    const userId = req.user._id;

    if (!title) return res.status(400).json({ message: "Job title is missing.", success: false });
    if (!description) return res.status(400).json({ message: "Job description is missing.", success: false });
    if (!requirements) return res.status(400).json({ message: "Requirements are missing.", success: false });
    if (!salary) return res.status(400).json({ message: "Salary is missing.", success: false });
    if (!location) return res.status(400).json({ message: "Location is missing.", success: false });
    if (!jobType) return res.status(400).json({ message: "Job type is missing.", success: false });
    if (!experience) return res.status(400).json({ message: "Experience level is missing.", success: false });
    if (positions === undefined) return res.status(400).json({ message: "Number of positions is missing.", success: false });
    if (!companyId) return res.status(400).json({ message: "Company selection is missing.", success: false });

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      positions,
      company: companyId,
      created_by: userId,
    });

    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// @desc    Get all jobs (with query / filters)
// @route   GET /api/v1/job/get
// @access  Public
const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    
    // Improved Search: Find all jobs or filter by title, description, OR company name
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    // If we have a keyword, let's also search for companies with that name
    if (keyword) {
        const Company = require('../models/Company');
        const matchingCompanies = await Company.find({ name: { $regex: keyword, $options: "i" } });
        const companyIds = matchingCompanies.map(c => c._id);
        if (companyIds.length > 0) {
            query.$or.push({ company: { $in: companyIds } });
        }
    }

    const jobs = await Job.find(query).populate({
      path: "company"
    }).sort({ createdAt: -1 });

    if (!jobs || jobs.length === 0) {
      return res.status(200).json({ jobs: [], success: true });
    }

    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// @desc    Get job by ID
// @route   GET /api/v1/job/get/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    // Fix: Added company to population for description page logos
    const job = await Job.findById(jobId).populate([
        { path: "applications" },
        { path: "company" }
    ]);

    if (!job) {
      return res.status(404).json({ message: "Job not found.", success: false });
    }

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// @desc    Get jobs created by Admin (Recruiter)
// @route   GET /api/v1/job/getadminjobs
// @access  Private (Recruiter)
const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.user._id;
    const jobs = await Job.find({ created_by: adminId }).populate({
      path: 'company',
      createdAt: -1
    });

    if (!jobs) {
      return res.status(404).json({ message: "Jobs not found.", success: false });
    }

    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// @desc    Update a job by ID (Admin)
// @route   PUT /api/v1/job/update/:id
// @access  Private (Recruiter)
const updateJob = async (req, res) => {
  try {
    const { title, description, requirements, salary, location, jobType, experience, positions } = req.body;
    const jobId = req.params.id;

    const updateData = {
      title,
      description,
      requirements: requirements?.split(","),
      salary,
      location,
      jobType,
      experienceLevel: experience,
      positions,
    };

    const job = await Job.findByIdAndUpdate(jobId, updateData, { new: true });

    if (!job) {
      return res.status(404).json({ message: "Job not found.", success: false });
    }

    return res.status(200).json({
      message: "Job updated successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// @desc    Get search suggestions (titles, companies, skills)
// @route   GET /api/v1/job/suggestions
// @access  Public
const getSuggestions = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    if (!keyword) return res.status(200).json({ suggestions: [], success: true });

    const query = { $regex: keyword, $options: "i" };
    
    // Find matching job titles and requirements
    const jobs = await Job.find({
      $or: [
        { title: query },
        { requirements: query }
      ]
    }).limit(10).select('title requirements');

    const Company = require('../models/Company');
    const companies = await Company.find({ name: query }).limit(5).select('name');

    // Combine results and get unique suggestions
    const suggestions = new Set();
    jobs.forEach(job => {
      suggestions.add(job.title);
      job.requirements.forEach(req => {
        if (req.toLowerCase().includes(keyword.toLowerCase())) {
          suggestions.add(req);
        }
      });
    });
    companies.forEach(company => suggestions.add(company.name));

    return res.status(200).json({ 
        suggestions: Array.from(suggestions).slice(0, 10), 
        success: true 
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

module.exports = {
  postJob,
  getAllJobs,
  getJobById,
  getAdminJobs,
  updateJob,
  getSuggestions,
};

const Company = require('../models/Company');
const { cloudinary, getDataUri } = require('../utils/cloudinary');

// @desc    Register new company
// @route   POST /api/v1/company/register
// @access  Private (Recruiter)
const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({ message: "Company name is required." });
    }

    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({ message: "You can't register same company twice." });
    }

    company = await Company.create({
      name: companyName,
      userId: req.user._id,
    });

    return res.status(201).json({
      message: "Company registered successfully.",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// @desc    Get companies by User ID
// @route   GET /api/v1/company/get
// @access  Private (Recruiter)
const getCompany = async (req, res) => {
  try {
    const userId = req.user._id;
    const companies = await Company.find({ userId });
    if (!companies) {
      return res.status(404).json({ message: "Companies not found.", success: false });
    }
    return res.status(200).json({ companies, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// @desc    Get company by ID
// @route   GET /api/v1/company/get/:id
// @access  Private
const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found.", success: false });
    }
    return res.status(200).json({ company, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// @desc    Update company info
// @route   PUT /api/v1/company/update/:id
// @access  Private (Recruiter)
const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const updateData = { name, description, website, location };

    if (req.file) {
        const fileUri = getDataUri(req.file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
            folder: "company_logos",
        });
        if (cloudResponse) {
            updateData.logo = cloudResponse.secure_url;
        }
    }

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!company) {
      return res.status(404).json({ message: "Company not found.", success: false });
    }

    return res.status(200).json({
      message: "Company information updated successfully.",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

module.exports = {
  registerCompany,
  getCompany,
  getCompanyById,
  updateCompany,
};

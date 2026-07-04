const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { cloudinary, getDataUri } = require('../utils/cloudinary');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { fullName, email, phoneNumber, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      fullName,
      email,
      phoneNumber,
      password,
      role,
    });

    if (user) {
      generateToken(res, user._id);
      res.status(201).json({
        message: 'Account created successfully.',
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
        },
        success: true
      });
    } else {
      res.status(400).json({ message: 'Invalid user data', success: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      // Check role
      if (role !== user.role) {
        return res.status(400).json({ message: "Account doesn't exist with current role", success: false });
      }

      generateToken(res, user._id);
      res.json({
        message: `Welcome back ${user.fullName}`,
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          profile: user.profile,
        },
        success: true
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password', success: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully', success: true });
};

// @desc    Update user profile
// @route   POST /api/v1/user/profile/update
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, bio, skills } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    // Update basic info
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    
    // Robust skills handling: check if it's a string from FormData
    if (skills && typeof skills === 'string') {
        user.profile.skills = skills.split(",").map(s => s.trim());
    } else if (Array.isArray(skills)) {
        user.profile.skills = skills;
    }

    // Resume upload using Cloudinary
    if (req.file) {
        const fileUri = getDataUri(req.file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
            folder: "resumes",
            resource_type: "auto"
        });
        
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url; // save the cloudinary url
            user.profile.resumeOriginalName = req.file.originalname; // save the original file name
        }
    }
    
    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        profile: user.profile
      },
      success: true
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// @desc    Save/Unsave a job
// @route   POST /api/v1/user/save/:id
// @access  Private
const saveJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const jobId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const isJobSaved = user.savedJobs.some(id => id.toString() === jobId);

    if (isJobSaved) {
      // Unsave
      user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
      await user.save();
      return res.status(200).json({ message: "Job removed from saved list", success: true });
    } else {
      // Save
      user.savedJobs.push(jobId);
      await user.save();
      return res.status(200).json({ message: "Job saved successfully", success: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// @desc    Forgot Password
// @route   POST /api/v1/user/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'There is no user with that email', success: false });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message
      });
      res.status(200).json({ message: 'Email sent', success: true });
    } catch (error) {
      console.log(error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ message: 'Email could not be sent', success: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// @desc    Reset Password
// @route   PUT /api/v1/user/reset-password/:resettoken
// @access  Public
const resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid token', success: false });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    generateToken(res, user._id);
    res.status(200).json({ message: 'Password reset successfully', success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = {
  registerUser,
  authUser,
  logoutUser,
  updateUserProfile,
  saveJob,
  forgotPassword,
  resetPassword,
};

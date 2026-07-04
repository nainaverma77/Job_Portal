const express = require('express');
const {
  registerUser,
  authUser,
  logoutUser,
  updateUserProfile,
  saveJob,
  forgotPassword,
  resetPassword,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const upload = require('../middleware/multer');

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.post('/profile/update', protect, upload.single('file'), updateUserProfile);
router.post('/save/:id', protect, saveJob);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

module.exports = router;

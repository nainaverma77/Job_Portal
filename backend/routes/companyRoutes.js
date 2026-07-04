const express = require('express');
const {
  registerCompany,
  getCompany,
  getCompanyById,
  updateCompany,
} = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');

const router = express.Router();

router.post('/register', protect, registerCompany);
router.get('/get', protect, getCompany);
router.get('/get/:id', protect, getCompanyById);
router.put('/update/:id', protect, upload.single('file'), updateCompany);

module.exports = router;

const express = require('express');
const {
  postJob,
  getAllJobs,
  getJobById,
  getAdminJobs,
  updateJob,
  getSuggestions,
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/post', protect, postJob);
router.get('/get', getAllJobs);
router.get('/suggestions', getSuggestions);
router.get('/getadminjobs', protect, getAdminJobs);
router.get('/get/:id', getJobById);
router.put('/update/:id', protect, updateJob);

module.exports = router;

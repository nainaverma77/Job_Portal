const express = require('express');
const {
  applyJob,
  getAppliedJobs,
  getApplicants,
  updateStatus,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/apply/:id', protect, applyJob);
router.get('/get', protect, getAppliedJobs);
router.get('/:id/applicants', protect, getApplicants);
router.post('/status/:id/update', protect, updateStatus);

module.exports = router;

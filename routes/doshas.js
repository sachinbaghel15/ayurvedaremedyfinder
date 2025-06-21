const express = require('express');
const {
  getDoshaInfo,
  getDoshaAssessment,
  submitDoshaAssessment,
  getDoshaRecommendations
} = require('../controllers/doshas');

const router = express.Router();

// Public routes
router.get('/info', getDoshaInfo);
router.get('/assessment', getDoshaAssessment);
router.post('/assessment', submitDoshaAssessment);
router.get('/recommendations/:doshaType', getDoshaRecommendations);

module.exports = router; 
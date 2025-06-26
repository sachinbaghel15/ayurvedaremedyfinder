const express = require('express');
const {
  getRemedies,
  getRemedyById,
  getRemediesBySymptom,
  getEnhancedRemediesBySymptom,
  searchRemedies
} = require('../controllers/remediesController');

const router = express.Router();

// This is a bit of a workaround for the enhanced route
// It's better to have more specific routes than query params for different resources
router.get('/enhanced/by-symptoms', getEnhancedRemediesBySymptom);

router.route('/').get(getRemedies);
router.route('/by-symptoms').get(getRemediesBySymptom);
router.get('/search', searchRemedies);
router.route('/:id').get(getRemedyById);

module.exports = router; 
const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  getRemedies,
  getRemedy,
  createRemedy,
  updateRemedy,
  deleteRemedy,
  addReview,
  getRemediesByDosha,
  getRemediesByCategory
} = require('../controllers/remedies');

const router = express.Router();

// Validation middleware
const remedyValidation = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Name must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .isIn(['digestive', 'respiratory', 'skin', 'joints', 'immunity', 'stress', 'sleep', 'energy', 'detox', 'other'])
    .withMessage('Invalid category'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Invalid difficulty level'),
  body('suitableFor')
    .isArray()
    .withMessage('SuitableFor must be an array'),
  body('suitableFor.*')
    .isIn(['vata', 'pitta', 'kapha', 'vata-pitta', 'pitta-kapha', 'vata-kapha', 'tridosha', 'all'])
    .withMessage('Invalid dosha type in suitableFor array')
];

const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
];

// Public routes
router.get('/', getRemedies);
router.get('/dosha/:doshaType', getRemediesByDosha);
router.get('/category/:category', getRemediesByCategory);
router.get('/:id', getRemedy);

// Protected routes
router.use(protect);

router.post('/', remedyValidation, createRemedy);
router.put('/:id', remedyValidation, updateRemedy);
router.delete('/:id', deleteRemedy);
router.post('/:id/reviews', reviewValidation, addReview);

module.exports = router; 
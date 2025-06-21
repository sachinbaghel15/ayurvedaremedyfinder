const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  getHerbs,
  getHerb,
  createHerb,
  updateHerb,
  deleteHerb,
  getHerbsByCategory,
  getHerbsByDoshaEffect
} = require('../controllers/herbs');

const router = express.Router();

// Validation middleware
const herbValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('scientificName')
    .trim()
    .notEmpty()
    .withMessage('Scientific name is required'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('virya')
    .isIn(['ushna', 'shita'])
    .withMessage('Invalid virya value'),
  body('vipaka')
    .isIn(['madhura', 'amla', 'katu'])
    .withMessage('Invalid vipaka value'),
  body('category')
    .isIn(['root', 'bark', 'leaf', 'flower', 'fruit', 'seed', 'resin', 'mineral', 'other'])
    .withMessage('Invalid category'),
  body('availability')
    .optional()
    .isIn(['common', 'uncommon', 'rare'])
    .withMessage('Invalid availability value'),
  body('sustainability')
    .optional()
    .isIn(['sustainable', 'moderate', 'endangered'])
    .withMessage('Invalid sustainability value')
];

// Public routes
router.get('/', getHerbs);
router.get('/category/:category', getHerbsByCategory);
router.get('/dosha-effect/:doshaType/:effect', getHerbsByDoshaEffect);
router.get('/:id', getHerb);

// Protected routes
router.use(protect);

router.post('/', authorize('publisher', 'admin'), herbValidation, createHerb);
router.put('/:id', authorize('publisher', 'admin'), herbValidation, updateHerb);
router.delete('/:id', authorize('admin'), deleteHerb);

module.exports = router; 
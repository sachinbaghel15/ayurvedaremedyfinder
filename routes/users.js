const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserProfile
} = require('../controllers/users');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin only routes
router.use(authorize('admin'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

// User profile route (accessible by user themselves)
router.get('/profile/me', getUserProfile);

module.exports = router; 
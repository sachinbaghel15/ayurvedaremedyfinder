const Remedy = require('../models/Remedy');

// @desc    Get all remedies
// @route   GET /api/remedies
// @access  Public
const getRemedies = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Remedy.find(JSON.parse(queryStr)).populate('createdBy', 'name');

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Remedy.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const remedies = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: remedies.length,
      pagination,
      data: remedies
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single remedy
// @route   GET /api/remedies/:id
// @access  Public
const getRemedy = async (req, res, next) => {
  try {
    const remedy = await Remedy.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('reviews.user', 'name');

    if (!remedy) {
      return res.status(404).json({
        success: false,
        message: 'Remedy not found'
      });
    }

    res.status(200).json({
      success: true,
      data: remedy
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new remedy
// @route   POST /api/remedies
// @access  Private
const createRemedy = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    const remedy = await Remedy.create(req.body);

    res.status(201).json({
      success: true,
      data: remedy
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update remedy
// @route   PUT /api/remedies/:id
// @access  Private
const updateRemedy = async (req, res, next) => {
  try {
    let remedy = await Remedy.findById(req.params.id);

    if (!remedy) {
      return res.status(404).json({
        success: false,
        message: 'Remedy not found'
      });
    }

    // Make sure user is remedy owner or admin
    if (remedy.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this remedy'
      });
    }

    remedy = await Remedy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: remedy
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete remedy
// @route   DELETE /api/remedies/:id
// @access  Private
const deleteRemedy = async (req, res, next) => {
  try {
    const remedy = await Remedy.findById(req.params.id);

    if (!remedy) {
      return res.status(404).json({
        success: false,
        message: 'Remedy not found'
      });
    }

    // Make sure user is remedy owner or admin
    if (remedy.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this remedy'
      });
    }

    await remedy.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review to remedy
// @route   POST /api/remedies/:id/reviews
// @access  Private
const addReview = async (req, res, next) => {
  try {
    const remedy = await Remedy.findById(req.params.id);

    if (!remedy) {
      return res.status(404).json({
        success: false,
        message: 'Remedy not found'
      });
    }

    // Check if user already reviewed
    const existingReview = remedy.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this remedy'
      });
    }

    const review = {
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment
    };

    remedy.reviews.push(review);

    // Calculate average rating
    remedy.calculateAverageRating();

    await remedy.save();

    res.status(200).json({
      success: true,
      data: remedy
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get remedies by dosha type
// @route   GET /api/remedies/dosha/:doshaType
// @access  Public
const getRemediesByDosha = async (req, res, next) => {
  try {
    const remedies = await Remedy.find({
      $or: [
        { suitableFor: req.params.doshaType },
        { suitableFor: 'all' }
      ],
      isApproved: true
    }).populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      count: remedies.length,
      data: remedies
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get remedies by category
// @route   GET /api/remedies/category/:category
// @access  Public
const getRemediesByCategory = async (req, res, next) => {
  try {
    const remedies = await Remedy.find({
      category: req.params.category,
      isApproved: true
    }).populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      count: remedies.length,
      data: remedies
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRemedies,
  getRemedy,
  createRemedy,
  updateRemedy,
  deleteRemedy,
  addReview,
  getRemediesByDosha,
  getRemediesByCategory
}; 
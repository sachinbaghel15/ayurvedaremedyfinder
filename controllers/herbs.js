const Herb = require('../models/Herb');

// @desc    Get all herbs
// @route   GET /api/herbs
// @access  Public
const getHerbs = async (req, res, next) => {
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
    query = Herb.find(JSON.parse(queryStr)).populate('createdBy', 'name');

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
      query = query.sort('name');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Herb.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const herbs = await query;

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
      count: herbs.length,
      pagination,
      data: herbs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single herb
// @route   GET /api/herbs/:id
// @access  Public
const getHerb = async (req, res, next) => {
  try {
    const herb = await Herb.findById(req.params.id).populate('createdBy', 'name');

    if (!herb) {
      return res.status(404).json({
        success: false,
        message: 'Herb not found'
      });
    }

    res.status(200).json({
      success: true,
      data: herb
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new herb
// @route   POST /api/herbs
// @access  Private
const createHerb = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    const herb = await Herb.create(req.body);

    res.status(201).json({
      success: true,
      data: herb
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update herb
// @route   PUT /api/herbs/:id
// @access  Private
const updateHerb = async (req, res, next) => {
  try {
    let herb = await Herb.findById(req.params.id);

    if (!herb) {
      return res.status(404).json({
        success: false,
        message: 'Herb not found'
      });
    }

    // Make sure user is herb owner or admin
    if (herb.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this herb'
      });
    }

    herb = await Herb.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: herb
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete herb
// @route   DELETE /api/herbs/:id
// @access  Private
const deleteHerb = async (req, res, next) => {
  try {
    const herb = await Herb.findById(req.params.id);

    if (!herb) {
      return res.status(404).json({
        success: false,
        message: 'Herb not found'
      });
    }

    await herb.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get herbs by category
// @route   GET /api/herbs/category/:category
// @access  Public
const getHerbsByCategory = async (req, res, next) => {
  try {
    const herbs = await Herb.find({
      category: req.params.category,
      isApproved: true
    }).populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      count: herbs.length,
      data: herbs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get herbs by dosha effect
// @route   GET /api/herbs/dosha-effect/:doshaType/:effect
// @access  Public
const getHerbsByDoshaEffect = async (req, res, next) => {
  try {
    const { doshaType, effect } = req.params;
    
    const query = {};
    query[`doshaEffects.${doshaType}`] = effect;

    const herbs = await Herb.find({
      ...query,
      isApproved: true
    }).populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      count: herbs.length,
      data: herbs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHerbs,
  getHerb,
  createHerb,
  updateHerb,
  deleteHerb,
  getHerbsByCategory,
  getHerbsByDoshaEffect
}; 
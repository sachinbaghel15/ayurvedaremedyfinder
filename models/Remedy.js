const mongoose = require('mongoose');

const RemedySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a remedy name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  ingredients: [{
    name: {
      type: String,
      required: true
    },
    quantity: String,
    unit: String
  }],
  instructions: {
    type: String,
    required: [true, 'Please add preparation instructions']
  },
  dosage: {
    amount: String,
    frequency: String,
    duration: String,
    timing: String
  },
  benefits: [String],
  contraindications: [String],
  suitableFor: [{
    type: String,
    enum: ['vata', 'pitta', 'kapha', 'vata-pitta', 'pitta-kapha', 'vata-kapha', 'tridosha', 'all']
  }],
  category: {
    type: String,
    enum: ['digestive', 'respiratory', 'skin', 'joints', 'immunity', 'stress', 'sleep', 'energy', 'detox', 'other'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  preparationTime: {
    type: Number, // in minutes
    default: 30
  },
  shelfLife: {
    type: String,
    default: 'Use immediately'
  },
  tags: [String],
  image: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
RemedySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate average rating
RemedySchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = totalRating / this.reviews.length;
  }
  return this.rating;
};

module.exports = mongoose.model('Remedy', RemedySchema); 
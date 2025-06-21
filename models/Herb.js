const mongoose = require('mongoose');

const HerbSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a herb name'],
    trim: true,
    unique: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  scientificName: {
    type: String,
    required: [true, 'Please add scientific name']
  },
  sanskritName: String,
  commonNames: [String],
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  rasa: [{
    type: String,
    enum: ['madhura', 'amla', 'lavana', 'katu', 'tikta', 'kashaya']
  }],
  guna: [{
    type: String,
    enum: ['guru', 'laghu', 'manda', 'tikshna', 'shita', 'ushna', 'snigdha', 'ruksha', 'mridu', 'kathina', 'pichchila', 'vishada', 'sara', 'sthira', 'sukshma', 'sthula', 'slakshna', 'khara']
  }],
  virya: {
    type: String,
    enum: ['ushna', 'shita'],
    required: true
  },
  vipaka: {
    type: String,
    enum: ['madhura', 'amla', 'katu'],
    required: true
  },
  doshaEffects: {
    vata: {
      type: String,
      enum: ['increases', 'decreases', 'balances', 'no_effect'],
      default: 'no_effect'
    },
    pitta: {
      type: String,
      enum: ['increases', 'decreases', 'balances', 'no_effect'],
      default: 'no_effect'
    },
    kapha: {
      type: String,
      enum: ['increases', 'decreases', 'balances', 'no_effect'],
      default: 'no_effect'
    }
  },
  therapeuticProperties: [String],
  indications: [String],
  contraindications: [String],
  dosage: {
    powder: String,
    decoction: String,
    oil: String,
    paste: String
  },
  sideEffects: [String],
  interactions: [String],
  harvestingSeason: String,
  storageInstructions: String,
  image: String,
  category: {
    type: String,
    enum: ['root', 'bark', 'leaf', 'flower', 'fruit', 'seed', 'resin', 'mineral', 'other'],
    required: true
  },
  availability: {
    type: String,
    enum: ['common', 'uncommon', 'rare'],
    default: 'common'
  },
  sustainability: {
    type: String,
    enum: ['sustainable', 'moderate', 'endangered'],
    default: 'sustainable'
  },
  references: [{
    title: String,
    author: String,
    year: Number,
    url: String
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
HerbSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Herb', HerbSchema); 
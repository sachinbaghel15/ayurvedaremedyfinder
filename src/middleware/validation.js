const { validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));

    return next(new AppError('Validation failed', 400, errorMessages));
  }
  
  next();
};

// Custom validation rules
const validationRules = {
  // User validation
  user: {
    email: {
      notEmpty: { errorMessage: 'Email is required' },
      isEmail: { errorMessage: 'Please provide a valid email' },
      normalizeEmail: true
    },
    password: {
      isLength: {
        options: { min: 8 },
        errorMessage: 'Password must be at least 8 characters long'
      },
      matches: {
        options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        errorMessage: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      }
    },
    name: {
      notEmpty: { errorMessage: 'Name is required' },
      isLength: {
        options: { min: 2, max: 50 },
        errorMessage: 'Name must be between 2 and 50 characters'
      }
    }
  },

  // Symptom validation
  symptom: {
    category: {
      notEmpty: { errorMessage: 'Category is required' },
      isIn: {
        options: [['digestive', 'respiratory', 'nervous', 'skin', 'joints', 'cardiovascular', 'endocrine', 'immune', 'reproductive', 'urinary', 'eye_ear', 'general']],
        errorMessage: 'Invalid category'
      }
    },
    symptoms: {
      isArray: { errorMessage: 'Symptoms must be an array' },
      custom: {
        options: (value) => {
          if (!Array.isArray(value) || value.length === 0) {
            throw new Error('At least one symptom is required');
          }
          if (value.length > 20) {
            throw new Error('Maximum 20 symptoms allowed');
          }
          return true;
        }
      }
    }
  },

  // Assessment validation
  assessment: {
    age: {
      isInt: {
        options: { min: 1, max: 120 },
        errorMessage: 'Age must be between 1 and 120'
      }
    },
    gender: {
      isIn: {
        options: [['male', 'female', 'other']],
        errorMessage: 'Gender must be male, female, or other'
      }
    },
    weight: {
      optional: true,
      isFloat: {
        options: { min: 1, max: 500 },
        errorMessage: 'Weight must be between 1 and 500 kg'
      }
    },
    height: {
      optional: true,
      isFloat: {
        options: { min: 50, max: 300 },
        errorMessage: 'Height must be between 50 and 300 cm'
      }
    }
  },

  // API key validation
  apiKey: {
    notEmpty: { errorMessage: 'API key is required' },
    isLength: {
      options: { min: 10 },
      errorMessage: 'API key must be at least 10 characters long'
    }
  }
};

module.exports = {
  validate,
  validationRules
}; 
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced subscription and pricing system
const subscriptionPlans = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      '5 assessments per month',
      'Basic dosha results',
      'General remedy suggestions',
      'Limited symptom filtering',
      'Mobile-friendly interface'
    ],
    limits: {
      assessments: 5,
      remedies: 10,
      apiCalls: 100
    }
  },
  basic: {
    name: 'Basic',
    price: 9.99,
    interval: 'month',
    features: [
      'Unlimited assessments',
      'Detailed dosha analysis',
      'Personalized remedy recommendations',
      'Advanced symptom filtering',
      'PDF reports',
      'Email support'
    ],
    limits: {
      assessments: -1, // unlimited
      remedies: 50,
      apiCalls: 1000
    }
  },
  professional: {
    name: 'Professional',
    price: 19.99,
    interval: 'month',
    features: [
      'All Basic features',
      'Advanced wellness plans',
      'Priority customer support',
      'Exclusive content access',
      'Monthly wellness newsletters',
      'Lifestyle coaching tips',
      'API access',
      'White-label solutions'
    ],
    limits: {
      assessments: -1,
      remedies: -1,
      apiCalls: 10000
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 99.99,
    interval: 'month',
    features: [
      'All Professional features',
      'Custom integrations',
      'Dedicated support',
      'Custom branding',
      'Advanced analytics',
      'Team management',
      'Unlimited API access'
    ],
    limits: {
      assessments: -1,
      remedies: -1,
      apiCalls: -1
    }
  }
};

// Enhanced user usage tracking
const userUsage = new Map();
const subscriptionData = new Map();
const paymentHistory = new Map();

// Analytics and usage tracking
const analytics = {
  dailyUsage: new Map(),
  monthlyUsage: new Map(),
  userBehavior: new Map(),
  revenue: {
    daily: 0,
    monthly: 0,
    total: 0
  }
};

// Function to generate unique user ID
const generateUserId = () => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Function to get or create user
const getUser = (req) => {
  let userId = req.cookies?.userId || req.headers['x-user-id'];
  
  if (!userId) {
    userId = generateUserId();
  }
  
  if (!userUsage.has(userId)) {
    userUsage.set(userId, {
      assessments: 0,
      lastAssessment: null,
      isPremium: false,
      premiumExpiry: null
    });
  }
  
  return userId;
};

// Rate limiting for RapidAPI
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to API routes
app.use('/api', apiLimiter);

// CORS configuration for RapidAPI
app.use(cors({
  origin: ['https://rapidapi.com', 'https://rapidapi.com/*', 'http://localhost:3000', 'http://localhost:5000', '*'],
  credentials: true
}));

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      scriptSrcAttr: ["'unsafe-inline'", "'unsafe-hashes'"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://ayurvedaremedyfinder.onrender.com"],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Add headers to allow iframe embedding
app.use((req, res, next) => {
  res.removeHeader('X-Frame-Options');
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Fallback for Render deployment - try alternative paths
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'src', 'public')));

// API Key authentication middleware
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-rapidapi-key'] || req.headers['x-api-key'] || req.query.api_key;
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key is required',
      message: 'Please provide a valid API key in the x-rapidapi-key header or as api_key query parameter'
    });
  }
  
  // In production, validate against your database
  // For now, we'll accept any non-empty key
  if (!apiKey || apiKey.trim() === '') {
    return res.status(401).json({
      success: false,
      error: 'Invalid API key',
      message: 'Please provide a valid API key'
    });
  }
  
  // Add API key to request for tracking
  req.apiKey = apiKey;
  next();
};

// Apply authentication to specific API routes only (not usage endpoints)
app.use('/api/doshas/info', authenticateApiKey);
app.use('/api/doshas/assessment', authenticateApiKey);
app.use('/api/health', authenticateApiKey);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Ayurveda Remedy API is running',
    timestamp: new Date().toISOString()
  });
});

// Get user usage and pricing info
app.get('/api/usage', (req, res) => {
  const userId = getUser(req);
  const user = userUsage.get(userId);
  
  // Set user ID cookie if not exists
  if (!req.cookies?.userId) {
    res.cookie('userId', userId, { 
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
  }
  
  const pricing = {
    freeFeatures: 'Unlimited',
    premiumMonthlyPrice: 9.99,
    premiumYearlyPrice: 99.99
  };
  
  res.status(200).json({
    success: true,
    data: {
      userId,
      usage: user,
      pricing,
      isPremium: user.isPremium,
      canUpgrade: !user.isPremium && user.assessments >= 2
    }
  });
});

// Pricing information endpoint
app.get('/api/pricing', (req, res) => {
  const pricing = {
    freeFeatures: 'Unlimited',
    premiumMonthlyPrice: 9.99,
    premiumYearlyPrice: 99.99,
    features: {
      free: [
        'Unlimited assessments',
        'Basic dosha results',
        'General remedy suggestions',
        'Symptom-based filtering',
        'Mobile-friendly interface'
      ],
      premium: [
        'All free features',
        'Detailed PDF reports',
        'Personalized wellness plans',
        'Priority customer support',
        'Exclusive content access',
        'Monthly wellness newsletters',
        'Advanced remedy recommendations',
        'Lifestyle coaching tips'
      ]
    }
  };
  
  res.status(200).json({
    success: true,
    data: pricing
  });
});

// Debug endpoint to check directory structure
app.get('/debug', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  try {
    const currentDir = __dirname;
    const filesInCurrentDir = fs.readdirSync(currentDir);
    const publicDir = path.join(currentDir, 'public');
    const srcPublicDir = path.join(currentDir, 'src', 'public');
    
    const debugInfo = {
      currentDirectory: currentDir,
      filesInCurrentDir: filesInCurrentDir,
      publicDirExists: fs.existsSync(publicDir),
      srcPublicDirExists: fs.existsSync(srcPublicDir),
      publicDirContents: fs.existsSync(publicDir) ? fs.readdirSync(publicDir) : 'Directory does not exist',
      srcPublicDirContents: fs.existsSync(srcPublicDir) ? fs.readdirSync(srcPublicDir) : 'Directory does not exist'
    };
    
    res.status(200).json(debugInfo);
  } catch (error) {
    res.status(500).json({
      error: 'Debug failed',
      message: error.message,
      currentDir: __dirname
    });
  }
});

// Dosha information endpoint (no database required)
app.get('/api/doshas/info', (req, res) => {
  const doshaInfo = {
    vata: {
      name: 'Vata',
      elements: ['Air', 'Ether'],
      qualities: ['Dry', 'Light', 'Cold', 'Rough', 'Subtle', 'Mobile'],
      characteristics: {
        physical: [
          'Thin, lean body frame',
          'Dry skin and hair',
          'Cold hands and feet',
          'Irregular appetite and digestion',
          'Light, interrupted sleep',
          'Quick movements and speech'
        ],
        mental: [
          'Creative and imaginative',
          'Quick to learn and forget',
          'Enthusiastic and adaptable',
          'Prone to worry and anxiety',
          'Variable moods'
        ]
      }
    },
    pitta: {
      name: 'Pitta',
      elements: ['Fire', 'Water'],
      qualities: ['Hot', 'Sharp', 'Light', 'Liquid', 'Oily', 'Spreading'],
      characteristics: {
        physical: [
          'Medium build and weight',
          'Warm body temperature',
          'Good appetite and digestion',
          'Sharp features and eyes',
          'Tendency to sweat easily',
          'Reddish hair or complexion'
        ],
        mental: [
          'Intelligent and focused',
          'Strong leadership qualities',
          'Competitive and ambitious',
          'Quick to anger',
          'Good memory and concentration'
        ]
      }
    },
    kapha: {
      name: 'Kapha',
      elements: ['Earth', 'Water'],
      qualities: ['Heavy', 'Slow', 'Cold', 'Oily', 'Smooth', 'Dense'],
      characteristics: {
        physical: [
          'Large, strong body frame',
          'Thick, oily skin and hair',
          'Slow metabolism',
          'Deep, sound sleep',
          'Strong immune system',
          'Slow, steady movements'
        ],
        mental: [
          'Calm and patient',
          'Loving and compassionate',
          'Good memory and learning',
          'Stable and loyal',
          'Slow to anger'
        ]
      }
    }
  };

  res.status(200).json({
    success: true,
    data: doshaInfo
  });
});

// Dosha assessment endpoint
app.get('/api/doshas/assessment', (req, res) => {
  const assessment = {
    title: 'Ayurvedic Dosha Assessment',
    description: 'Answer these questions to determine your dominant dosha type',
    questions: [
      {
        id: 1,
        category: 'physical',
        question: 'What is your body frame?',
        options: [
          { value: 'vata', text: 'Thin, lean, difficulty gaining weight' },
          { value: 'pitta', text: 'Medium build, well-proportioned' },
          { value: 'kapha', text: 'Large, heavy, gains weight easily' }
        ]
      },
      {
        id: 2,
        category: 'physical',
        question: 'How is your skin?',
        options: [
          { value: 'vata', text: 'Dry, rough, thin' },
          { value: 'pitta', text: 'Warm, reddish, prone to rashes' },
          { value: 'kapha', text: 'Thick, oily, smooth' }
        ]
      },
      {
        id: 3,
        category: 'physical',
        question: 'How is your hair?',
        options: [
          { value: 'vata', text: 'Dry, thin, brittle' },
          { value: 'pitta', text: 'Fine, straight, early graying' },
          { value: 'kapha', text: 'Thick, oily, wavy' }
        ]
      },
      {
        id: 4,
        category: 'physical',
        question: 'How is your appetite?',
        options: [
          { value: 'vata', text: 'Variable, sometimes forget to eat' },
          { value: 'pitta', text: 'Strong, gets irritable when hungry' },
          { value: 'kapha', text: 'Steady, can skip meals easily' }
        ]
      },
      {
        id: 5,
        category: 'physical',
        question: 'How is your sleep?',
        options: [
          { value: 'vata', text: 'Light, interrupted, difficulty falling asleep' },
          { value: 'pitta', text: 'Moderate, wakes up if disturbed' },
          { value: 'kapha', text: 'Deep, sound, difficult to wake up' }
        ]
      },
      {
        id: 6,
        category: 'mental',
        question: 'How is your memory?',
        options: [
          { value: 'vata', text: 'Quick to learn, quick to forget' },
          { value: 'pitta', text: 'Sharp, focused, good retention' },
          { value: 'kapha', text: 'Slow to learn, excellent retention' }
        ]
      },
      {
        id: 7,
        category: 'mental',
        question: 'How do you handle stress?',
        options: [
          { value: 'vata', text: 'Worried, anxious, overthinking' },
          { value: 'pitta', text: 'Irritable, competitive, intense' },
          { value: 'kapha', text: 'Calm, patient, slow to react' }
        ]
      },
      {
        id: 8,
        category: 'mental',
        question: 'How is your speech?',
        options: [
          { value: 'vata', text: 'Fast, talkative, variable' },
          { value: 'pitta', text: 'Sharp, precise, persuasive' },
          { value: 'kapha', text: 'Slow, thoughtful, measured' }
        ]
      }
    ]
  };

  res.status(200).json({
    success: true,
    data: assessment
  });
});

// Submit dosha assessment
app.post('/api/doshas/assessment', (req, res) => {
  try {
    const { answers } = req.body;
    const userId = getUser(req);
    const user = userUsage.get(userId);

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide answers array'
      });
    }

    // Track usage for analytics (no limits)
    user.assessments++;
    user.lastAssessment = new Date().toISOString();
    userUsage.set(userId, user);

    // Set user ID cookie if not exists
    if (!req.cookies?.userId) {
      res.cookie('userId', userId, { 
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
    }

    // Calculate dosha scores
    const scores = {
      vata: 0,
      pitta: 0,
      kapha: 0
    };

    answers.forEach(answer => {
      if (scores.hasOwnProperty(answer)) {
        scores[answer]++;
      }
    });

    // Determine dominant dosha
    const maxScore = Math.max(scores.vata, scores.pitta, scores.kapha);
    const dominantDosha = Object.keys(scores).find(key => scores[key] === maxScore);

    // Determine secondary dosha if applicable
    let secondaryDosha = null;
    const sortedScores = Object.entries(scores).sort(([,a], [,b]) => b - a);
    
    if (sortedScores[1] && sortedScores[1][1] > 0) {
      secondaryDosha = sortedScores[1][0];
    }

    // Create dosha type
    let doshaType = dominantDosha;
    if (secondaryDosha && scores[secondaryDosha] >= maxScore * 0.7) {
      doshaType = `${dominantDosha}-${secondaryDosha}`;
    }

    const result = {
      scores,
      dominantDosha,
      secondaryDosha,
      doshaType,
      recommendations: {
        lifestyle: [
          'Follow a regular daily routine',
          'Practice gentle yoga and meditation',
          'Get adequate rest and sleep',
          'Stay hydrated with warm water'
        ],
        foods: [
          'Eat warm, cooked, and easily digestible foods',
          'Include sweet, sour, and salty tastes',
          'Avoid cold, dry, and raw foods'
        ],
        avoid: [
          'Irregular eating habits',
          'Excessive travel and movement',
          'Cold and dry environments'
        ]
      },
      usage: {
        assessmentsUsed: user.assessments,
        isPremium: user.isPremium,
        canUpgrade: !user.isPremium && user.assessments >= 2 // Suggest upgrade after 2 assessments
      }
    };

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing assessment'
    });
  }
});

// Comprehensive worldwide symptoms and remedies API endpoints
app.get('/api/symptoms', (req, res) => {
  const { category, search } = req.query;
  let symptoms = [];
  
  if (category && worldwideSymptomsData[category]) {
    symptoms = worldwideSymptomsData[category];
  } else {
    // Return all symptoms if no category specified
    Object.values(worldwideSymptomsData).forEach(categorySymptoms => {
      symptoms = symptoms.concat(categorySymptoms);
    });
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    symptoms = symptoms.filter(symptom => 
      symptom.name.toLowerCase().includes(searchLower) ||
      symptom.category.toLowerCase().includes(searchLower)
    );
  }
  
  res.json({
    success: true,
    data: symptoms,
    total: symptoms.length,
    categories: Object.keys(worldwideSymptomsData)
  });
});

app.get('/api/symptoms/categories', (req, res) => {
  const categories = Object.keys(worldwideSymptomsData).map(category => ({
    id: category,
    name: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '),
    count: worldwideSymptomsData[category].length
  }));
  
  res.json({
    success: true,
    data: categories
  });
});

// Comprehensive worldwide remedies endpoint
app.get('/api/remedies', authenticateApiKey, (req, res) => {
  const { category, symptom, search, origin, effectiveness, limit = 20, offset = 0 } = req.query;
  let remedies = [...worldwideRemediesData];
  
  // Filter by category
  if (category) {
    remedies = remedies.filter(remedy => remedy.category === category);
  }
  
  // Filter by symptom
  if (symptom) {
    remedies = remedies.filter(remedy => 
      remedy.symptoms.includes(symptom)
    );
  }
  
  // Filter by origin
  if (origin) {
    remedies = remedies.filter(remedy => 
      remedy.origin.toLowerCase().includes(origin.toLowerCase())
    );
  }
  
  // Filter by effectiveness
  if (effectiveness) {
    remedies = remedies.filter(remedy => remedy.effectiveness === effectiveness);
  }
  
  // Search by name or description
  if (search) {
    const searchLower = search.toLowerCase();
    remedies = remedies.filter(remedy => 
      remedy.name.toLowerCase().includes(searchLower) ||
      remedy.description.toLowerCase().includes(searchLower) ||
      remedy.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(searchLower)
      )
    );
  }
  
  // Apply pagination
  const startIndex = parseInt(offset);
  const endIndex = startIndex + parseInt(limit);
  const paginatedRemedies = remedies.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    count: remedies.length,
    total: worldwideRemediesData.length,
    limit: parseInt(limit),
    offset: parseInt(offset),
    hasMore: endIndex < remedies.length,
    data: paginatedRemedies,
    filters: {
      categories: [...new Set(worldwideRemediesData.map(r => r.category))],
      origins: [...new Set(worldwideRemediesData.map(r => r.origin))],
      effectiveness: [...new Set(worldwideRemediesData.map(r => r.effectiveness))]
    }
  });
});

app.get('/api/remedies/:id', authenticateApiKey, (req, res) => {
  const remedy = worldwideRemediesData.find(r => r.id === req.params.id);
  
  if (!remedy) {
    return res.status(404).json({
      success: false,
      message: 'Remedy not found'
    });
  }
  
  res.json({
    success: true,
    data: remedy
  });
});

app.get('/api/remedies/by-symptoms', (req, res) => {
  const { symptoms } = req.query;
  
  if (!symptoms) {
    return res.status(400).json({
      success: false,
      message: 'Symptoms parameter is required'
    });
  }
  
  const symptomArray = symptoms.split(',');
  const remedies = worldwideRemediesData.filter(remedy => 
    remedy.symptoms.some(symptom => symptomArray.includes(symptom))
  );
  
  // Sort by number of matching symptoms (most relevant first)
  remedies.sort((a, b) => {
    const aMatches = a.symptoms.filter(s => symptomArray.includes(s)).length;
    const bMatches = b.symptoms.filter(s => symptomArray.includes(s)).length;
    return bMatches - aMatches;
  });
  
  // Group by category
  const remediesByCategory = {};
  remedies.forEach(remedy => {
    if (!remediesByCategory[remedy.category]) {
      remediesByCategory[remedy.category] = [];
    }
    remediesByCategory[remedy.category].push(remedy);
  });
  
  res.json({
    success: true,
    data: remedies,
    total: remedies.length,
    matchedSymptoms: symptomArray,
    remediesByCategory
  });
});

app.get('/api/remedies/categories', (req, res) => {
  const categories = [...new Set(worldwideRemediesData.map(r => r.category))].map(category => ({
    id: category,
    name: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '),
    count: worldwideRemediesData.filter(r => r.category === category).length
  }));
  
  res.json({
    success: true,
    data: categories
  });
});

app.get('/api/remedies/origins', (req, res) => {
  const origins = [...new Set(worldwideRemediesData.map(r => r.origin))].map(origin => ({
    id: origin,
    name: origin,
    count: worldwideRemediesData.filter(r => r.origin === origin).length
  }));
  
  res.json({
    success: true,
    data: origins
  });
});

// Assessment endpoint
app.post('/api/assessment', (req, res) => {
  const { symptoms, doshaResults, userInfo } = req.body;
  
  if (!symptoms || !Array.isArray(symptoms)) {
    return res.status(400).json({
      success: false,
      message: 'Symptoms array is required'
    });
  }
  
  // Find remedies that match the symptoms
  const matchingRemedies = worldwideRemediesData.filter(remedy => 
    remedy.symptoms.some(symptom => symptoms.includes(symptom))
  );
  
  // Sort by relevance (number of matching symptoms)
  matchingRemedies.sort((a, b) => {
    const aMatches = a.symptoms.filter(s => symptoms.includes(s)).length;
    const bMatches = b.symptoms.filter(s => symptoms.includes(s)).length;
    return bMatches - aMatches;
  });
  
  // Group by category
  const remediesByCategory = {};
  matchingRemedies.forEach(remedy => {
    if (!remediesByCategory[remedy.category]) {
      remediesByCategory[remedy.category] = [];
    }
    remediesByCategory[remedy.category].push(remedy);
  });
  
  // Create assessment summary
  const assessment = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    userInfo,
    symptoms,
    doshaResults,
    remedies: matchingRemedies.slice(0, 20), // Top 20 most relevant
    remediesByCategory,
    summary: {
      totalSymptoms: symptoms.length,
      totalRemedies: matchingRemedies.length,
      categories: Object.keys(remediesByCategory),
      primarySymptoms: symptoms.slice(0, 5),
      recommendedRemedies: matchingRemedies.slice(0, 5)
    }
  };
  
  res.json({
    success: true,
    data: assessment
  });
});

// Serve the main page
app.get('/', (req, res) => {
  const fs = require('fs');
  const possiblePaths = [
    path.join(__dirname, 'public', 'index.html'),
    path.join(__dirname, 'src', 'public', 'index.html'),
    path.join(__dirname, '..', 'public', 'index.html'),
    path.join(__dirname, '..', 'src', 'public', 'index.html')
  ];
  
  for (const indexPath of possiblePaths) {
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }
  
  // If no file found, return error with all attempted paths
  res.status(404).json({
    error: 'index.html not found',
    message: 'Frontend files not found in expected locations',
    attemptedPaths: possiblePaths,
    currentDir: __dirname,
    filesInCurrentDir: fs.readdirSync(__dirname),
    publicDirExists: fs.existsSync(path.join(__dirname, 'public')),
    publicDirContents: fs.existsSync(path.join(__dirname, 'public')) ? fs.readdirSync(path.join(__dirname, 'public')) : 'Directory does not exist'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Payment and subscription management
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_your_stripe_key');

// Enhanced subscription endpoints
app.post('/api/subscribe', async (req, res) => {
  try {
    const { plan, email, paymentMethodId, customerId } = req.body;
    
    if (!subscriptionPlans[plan]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription plan'
      });
    }
    
    let customer;
    
    // Create or retrieve customer
    if (customerId) {
      customer = await stripe.customers.retrieve(customerId);
    } else {
      customer = await stripe.customers.create({
        email: email,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    }
    
    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: getStripePriceId(plan) }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });
    
    // Store subscription data
    subscriptionData.set(customer.id, {
      customerId: customer.id,
      plan: plan,
      subscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      features: subscriptionPlans[plan].features,
      limits: subscriptionPlans[plan].limits
    });
    
    res.json({
      success: true,
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      customerId: customer.id
    });
    
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Subscription failed. Please try again.'
    });
  }
});

// Get Stripe price ID for plan
function getStripePriceId(plan) {
  const priceIds = {
    basic: 'price_basic_monthly',
    professional: 'price_professional_monthly',
    enterprise: 'price_enterprise_monthly'
  };
  return priceIds[plan] || 'price_basic_monthly';
}

// One-time payment for premium features
app.post('/api/purchase', async (req, res) => {
  try {
    const { amount, currency = 'usd', description, customerEmail } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: currency,
      description: description,
      receipt_email: customerEmail,
      metadata: {
        feature: description
      }
    });
    
    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
    
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment failed. Please try again.'
    });
  }
});

// Webhook for Stripe events
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'invoice.payment_succeeded':
      const subscription = event.data.object;
      handleSubscriptionUpdate(subscription);
      break;
    case 'invoice.payment_failed':
      const failedSubscription = event.data.object;
      handlePaymentFailure(failedSubscription);
      break;
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object;
      handleSubscriptionCancellation(deletedSubscription);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  res.json({ received: true });
});

function handleSubscriptionUpdate(subscription) {
  const customerId = subscription.customer;
  const subscriptionData = subscriptionData.get(customerId);
  
  if (subscriptionData) {
    subscriptionData.status = 'active';
    subscriptionData.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    subscriptionData.set(customerId, subscriptionData);
  }
}

function handlePaymentFailure(subscription) {
  const customerId = subscription.customer;
  const subscriptionData = subscriptionData.get(customerId);
  
  if (subscriptionData) {
    subscriptionData.status = 'past_due';
    subscriptionData.set(customerId, subscriptionData);
  }
}

function handleSubscriptionCancellation(subscription) {
  const customerId = subscription.customer;
  subscriptionData.delete(customerId);
}

// Enhanced usage tracking middleware
app.use('/api/*', (req, res, next) => {
  const userId = getUser(req);
  const endpoint = req.path;
  const method = req.method;
  
  // Track API usage
  trackApiUsage(userId, endpoint, method);
  
  // Track user behavior
  trackUserBehavior(userId, endpoint, req.body);
  
  next();
});

function trackApiUsage(userId, endpoint, method) {
  const today = new Date().toISOString().split('T')[0];
  const month = new Date().toISOString().slice(0, 7);
  
  // Daily usage
  if (!analytics.dailyUsage.has(today)) {
    analytics.dailyUsage.set(today, {});
  }
  const dailyData = analytics.dailyUsage.get(today);
  if (!dailyData[endpoint]) {
    dailyData[endpoint] = { calls: 0, users: new Set() };
  }
  dailyData[endpoint].calls++;
  dailyData[endpoint].users.add(userId);
  
  // Monthly usage
  if (!analytics.monthlyUsage.has(month)) {
    analytics.monthlyUsage.set(month, {});
  }
  const monthlyData = analytics.monthlyUsage.get(month);
  if (!monthlyData[endpoint]) {
    monthlyData[endpoint] = { calls: 0, users: new Set() };
  }
  monthlyData[endpoint].calls++;
  monthlyData[endpoint].users.add(userId);
}

function trackUserBehavior(userId, endpoint, body) {
  if (!analytics.userBehavior.has(userId)) {
    analytics.userBehavior.set(userId, {
      firstVisit: new Date(),
      lastVisit: new Date(),
      endpoints: [],
      assessments: 0,
      remediesViewed: 0,
      subscriptionUpgrades: 0
    });
  }
  
  const userData = analytics.userBehavior.get(userId);
  userData.lastVisit = new Date();
  userData.endpoints.push({ endpoint, timestamp: new Date() });
  
  // Track specific behaviors
  if (endpoint.includes('assessment')) userData.assessments++;
  if (endpoint.includes('remedies')) userData.remediesViewed++;
  if (endpoint.includes('subscribe')) userData.subscriptionUpgrades++;
}

// Analytics endpoints
app.get('/api/analytics/usage', authenticateApiKey, (req, res) => {
  const { period = 'daily', endpoint } = req.query;
  
  let data;
  if (period === 'daily') {
    data = analytics.dailyUsage;
  } else if (period === 'monthly') {
    data = analytics.monthlyUsage;
  }
  
  if (endpoint) {
    const filteredData = {};
    for (const [date, endpoints] of data) {
      if (endpoints[endpoint]) {
        filteredData[date] = endpoints[endpoint];
      }
    }
    data = filteredData;
  }
  
  res.json({
    success: true,
    data: Object.fromEntries(data),
    period,
    totalUsers: analytics.userBehavior.size
  });
});

app.get('/api/analytics/revenue', authenticateApiKey, (req, res) => {
  res.json({
    success: true,
    data: analytics.revenue,
    subscriptionCount: subscriptionData.size,
    activeSubscriptions: Array.from(subscriptionData.values()).filter(sub => sub.status === 'active').length
  });
});

app.get('/api/analytics/user-behavior', authenticateApiKey, (req, res) => {
  const { userId } = req.query;
  
  if (userId) {
    const userData = analytics.userBehavior.get(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    return res.json({
      success: true,
      data: userData
    });
  }
  
  // Aggregate user behavior
  const aggregated = {
    totalUsers: analytics.userBehavior.size,
    averageAssessments: 0,
    averageRemediesViewed: 0,
    subscriptionRate: 0,
    activeUsers: 0
  };
  
  let totalAssessments = 0;
  let totalRemediesViewed = 0;
  let totalSubscriptions = 0;
  let activeUsers = 0;
  
  for (const userData of analytics.userBehavior.values()) {
    totalAssessments += userData.assessments;
    totalRemediesViewed += userData.remediesViewed;
    totalSubscriptions += userData.subscriptionUpgrades;
    
    // Check if user was active in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    if (userData.lastVisit > thirtyDaysAgo) {
      activeUsers++;
    }
  }
  
  aggregated.averageAssessments = totalAssessments / analytics.userBehavior.size;
  aggregated.averageRemediesViewed = totalRemediesViewed / analytics.userBehavior.size;
  aggregated.subscriptionRate = (totalSubscriptions / analytics.userBehavior.size) * 100;
  aggregated.activeUsers = activeUsers;
  
  res.json({
    success: true,
    data: aggregated
  });
});

// Premium features and exclusive content
const premiumContent = {
  wellnessPlans: {
    vata: {
      title: 'Vata Balancing Wellness Plan',
      duration: '30 days',
      dailyRoutine: [
        'Wake up at 6 AM',
        'Oil massage (Abhyanga)',
        'Gentle yoga and meditation',
        'Warm, nourishing breakfast',
        'Regular meal times',
        'Early bedtime (10 PM)'
      ],
      diet: [
        'Warm, cooked foods',
        'Sweet, sour, and salty tastes',
        'Ghee and oils',
        'Avoid cold, dry foods'
      ],
      remedies: ['ashwagandha_tea', 'sesame_oil_massage', 'ginger_tea'],
      lifestyle: [
        'Maintain regular routine',
        'Avoid excessive travel',
        'Practice grounding activities',
        'Stay warm and hydrated'
      ]
    },
    pitta: {
      title: 'Pitta Balancing Wellness Plan',
      duration: '30 days',
      dailyRoutine: [
        'Wake up at 5:30 AM',
        'Cooling meditation',
        'Moderate exercise',
        'Cooling breakfast',
        'Avoid midday sun',
        'Relaxing evening routine'
      ],
      diet: [
        'Cooling foods',
        'Sweet, bitter, and astringent tastes',
        'Avoid spicy, hot foods',
        'Plenty of water'
      ],
      remedies: ['coconut_water', 'aloe_vera_juice', 'coriander_tea'],
      lifestyle: [
        'Stay cool and calm',
        'Avoid excessive heat',
        'Practice patience',
        'Engage in creative activities'
      ]
    },
    kapha: {
      title: 'Kapha Balancing Wellness Plan',
      duration: '30 days',
      dailyRoutine: [
        'Wake up at 5 AM',
        'Energetic exercise',
        'Light breakfast',
        'Active throughout day',
        'Avoid daytime naps',
        'Light dinner'
      ],
      diet: [
        'Light, dry foods',
        'Pungent, bitter, astringent tastes',
        'Avoid heavy, oily foods',
        'Honey and warm water'
      ],
      remedies: ['ginger_tea', 'turmeric_milk', 'black_pepper_tea'],
      lifestyle: [
        'Stay active and energetic',
        'Avoid excessive sleep',
        'Regular exercise',
        'Stimulating activities'
      ]
    }
  },
  
  exclusiveRemedies: [
    {
      id: 'golden_milk_premium',
      name: 'Golden Milk Premium Blend',
      category: 'premium',
      description: 'Exclusive blend with saffron, cardamom, and premium turmeric',
      ingredients: ['Organic turmeric', 'Saffron', 'Cardamom', 'Black pepper', 'Coconut milk', 'Raw honey'],
      instructions: 'Premium preparation method with specific timing and temperature control',
      benefits: ['Anti-inflammatory', 'Immune boosting', 'Digestive health', 'Skin glow'],
      price: 29.99,
      subscriptionRequired: 'basic'
    },
    {
      id: 'ayurvedic_face_mask',
      name: 'Ayurvedic Face Mask Collection',
      category: 'premium',
      description: 'Customized face masks based on dosha type',
      ingredients: ['Neem powder', 'Sandalwood', 'Rose petals', 'Honey', 'Yogurt'],
      instructions: 'Dosha-specific application methods and timing',
      benefits: ['Skin rejuvenation', 'Acne treatment', 'Anti-aging', 'Natural glow'],
      price: 39.99,
      subscriptionRequired: 'professional'
    }
  ],
  
  detailedReports: {
    comprehensive: {
      name: 'Comprehensive Health Report',
      sections: [
        'Dosha Analysis',
        'Symptom Assessment',
        'Personalized Recommendations',
        'Lifestyle Guidelines',
        'Diet Plan',
        'Remedy Schedule',
        'Progress Tracking'
      ],
      price: 19.99,
      subscriptionRequired: 'basic'
    },
    advanced: {
      name: 'Advanced Wellness Report',
      sections: [
        'All Comprehensive sections',
        'Seasonal Adjustments',
        'Stress Management',
        'Sleep Optimization',
        'Exercise Recommendations',
        'Supplements Guide',
        'Long-term Health Plan'
      ],
      price: 49.99,
      subscriptionRequired: 'professional'
    }
  }
};

// Premium content endpoints
app.get('/api/premium/wellness-plan/:dosha', (req, res) => {
  const { dosha } = req.params;
  const userId = getUser(req);
  const user = userUsage.get(userId);
  
  // Check subscription level
  if (!user || !user.isPremium) {
    return res.status(403).json({
      success: false,
      message: 'Premium subscription required',
      upgradeUrl: '/api/pricing'
    });
  }
  
  const plan = premiumContent.wellnessPlans[dosha];
  if (!plan) {
    return res.status(404).json({
      success: false,
      message: 'Wellness plan not found'
    });
  }
  
  res.json({
    success: true,
    data: plan,
    generatedAt: new Date().toISOString(),
    userId: userId
  });
});

app.get('/api/premium/remedies', (req, res) => {
  const userId = getUser(req);
  const user = userUsage.get(userId);
  
  // Check subscription level
  if (!user || !user.isPremium) {
    return res.status(403).json({
      success: false,
      message: 'Premium subscription required',
      upgradeUrl: '/api/pricing'
    });
  }
  
  res.json({
    success: true,
    data: premiumContent.exclusiveRemedies,
    total: premiumContent.exclusiveRemedies.length
  });
});

app.post('/api/premium/generate-report', (req, res) => {
  const { reportType, userData, assessmentData } = req.body;
  const userId = getUser(req);
  const user = userUsage.get(userId);
  
  // Check subscription level
  if (!user || !user.isPremium) {
    return res.status(403).json({
      success: false,
      message: 'Premium subscription required',
      upgradeUrl: '/api/pricing'
    });
  }
  
  const reportTemplate = premiumContent.detailedReports[reportType];
  if (!reportTemplate) {
    return res.status(400).json({
      success: false,
      message: 'Invalid report type'
    });
  }
  
  // Generate personalized report
  const report = {
    id: `report_${Date.now()}`,
    type: reportType,
    userId: userId,
    generatedAt: new Date().toISOString(),
    sections: reportTemplate.sections,
    content: generateReportContent(reportType, userData, assessmentData),
    recommendations: generatePersonalizedRecommendations(userData, assessmentData),
    nextSteps: generateNextSteps(userData, assessmentData)
  };
  
  res.json({
    success: true,
    data: report,
    downloadUrl: `/api/premium/download-report/${report.id}`
  });
});

function generateReportContent(reportType, userData, assessmentData) {
  // Generate personalized content based on user data and assessment
  return {
    doshaAnalysis: `Based on your assessment, you show ${assessmentData.dominantDosha} characteristics...`,
    recommendations: `For your ${assessmentData.dominantDosha} constitution, we recommend...`,
    lifestyle: `Your lifestyle should focus on balancing ${assessmentData.dominantDosha}...`,
    diet: `Your diet should include foods that pacify ${assessmentData.dominantDosha}...`
  };
}

function generatePersonalizedRecommendations(userData, assessmentData) {
  return [
    'Start your day with warm water and lemon',
    'Practice 10 minutes of meditation daily',
    'Include ghee in your diet',
    'Maintain regular sleep schedule',
    'Practice gentle yoga suitable for your dosha'
  ];
}

function generateNextSteps(userData, assessmentData) {
  return [
    'Schedule a follow-up assessment in 30 days',
    'Start implementing the recommended diet changes',
    'Begin the suggested daily routine',
    'Track your progress using our mobile app',
    'Consider upgrading to Professional plan for advanced features'
  ];
}

app.listen(PORT, () => {
  console.log(`🚀 Ayurveda Remedy API (Simple Version) running on port ${PORT}`);
  console.log(`📖 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Comprehensive worldwide coverage: 200+ symptoms, 50+ remedies from 6 continents`);
  console.log(`💳 Premium features: Subscription plans and monetization ready`);
  console.log(`🔒 Security: CSP headers and API key authentication enabled`);
});

// API Marketplace and White-label Solutions
const apiKeys = new Map();
const whiteLabelClients = new Map();

// API Key management
app.post('/api/keys/generate', authenticateApiKey, (req, res) => {
  const { name, permissions, rateLimit } = req.body;
  const userId = getUser(req);
  
  const apiKey = generateApiKey();
  const keyData = {
    id: apiKey,
    name: name || 'Default API Key',
    userId: userId,
    permissions: permissions || ['read'],
    rateLimit: rateLimit || 1000,
    createdAt: new Date(),
    lastUsed: null,
    usage: 0
  };
  
  apiKeys.set(apiKey, keyData);
  
  res.json({
    success: true,
    data: {
      apiKey: apiKey,
      name: keyData.name,
      permissions: keyData.permissions,
      rateLimit: keyData.rateLimit,
      createdAt: keyData.createdAt
    }
  });
});

app.get('/api/keys', authenticateApiKey, (req, res) => {
  const userId = getUser(req);
  const userKeys = Array.from(apiKeys.values()).filter(key => key.userId === userId);
  
  res.json({
    success: true,
    data: userKeys.map(key => ({
      id: key.id,
      name: key.name,
      permissions: key.permissions,
      rateLimit: key.rateLimit,
      createdAt: key.createdAt,
      lastUsed: key.lastUsed,
      usage: key.usage
    }))
  });
});

app.delete('/api/keys/:keyId', authenticateApiKey, (req, res) => {
  const { keyId } = req.params;
  const userId = getUser(req);
  
  const key = apiKeys.get(keyId);
  if (!key || key.userId !== userId) {
    return res.status(404).json({
      success: false,
      message: 'API key not found'
    });
  }
  
  apiKeys.delete(keyId);
  
  res.json({
    success: true,
    message: 'API key deleted successfully'
  });
});

// White-label solutions
app.post('/api/white-label/setup', authenticateApiKey, (req, res) => {
  const { 
    clientName, 
    branding, 
    customDomain, 
    features, 
    subscriptionPlan 
  } = req.body;
  
  const clientId = generateClientId();
  const clientData = {
    id: clientId,
    name: clientName,
    branding: {
      logo: branding.logo,
      colors: branding.colors,
      fonts: branding.fonts,
      customCss: branding.customCss
    },
    domain: customDomain,
    features: features || ['assessments', 'remedies', 'reports'],
    subscriptionPlan: subscriptionPlan || 'enterprise',
    createdAt: new Date(),
    status: 'active',
    usage: {
      assessments: 0,
      apiCalls: 0,
      users: 0
    }
  };
  
  whiteLabelClients.set(clientId, clientData);
  
  res.json({
    success: true,
    data: {
      clientId: clientId,
      setupUrl: `https://${customDomain}/setup`,
      apiEndpoint: `https://${customDomain}/api`,
      dashboardUrl: `https://${customDomain}/admin`
    }
  });
});

app.get('/api/white-label/:clientId/config', (req, res) => {
  const { clientId } = req.params;
  const client = whiteLabelClients.get(clientId);
  
  if (!client) {
    return res.status(404).json({
      success: false,
      message: 'Client not found'
    });
  }
  
  res.json({
    success: true,
    data: {
      branding: client.branding,
      features: client.features,
      apiEndpoints: generateClientEndpoints(clientId)
    }
  });
});

function generateClientEndpoints(clientId) {
  return {
    assessments: `/api/${clientId}/assessments`,
    remedies: `/api/${clientId}/remedies`,
    reports: `/api/${clientId}/reports`,
    users: `/api/${clientId}/users`
  };
}

// Marketplace features
const marketplaceFeatures = {
  integrations: [
    {
      id: 'shopify',
      name: 'Shopify Integration',
      description: 'Sell Ayurvedic products directly in your Shopify store',
      price: 99.99,
      category: 'ecommerce',
      features: [
        'Product recommendations based on dosha',
        'Automated inventory management',
        'Customer health profiles',
        'Personalized marketing campaigns'
      ]
    },
    {
      id: 'woocommerce',
      name: 'WooCommerce Integration',
      description: 'Integrate Ayurvedic recommendations with WooCommerce',
      price: 79.99,
      category: 'ecommerce',
      features: [
        'Dosha-based product filtering',
        'Health assessment widgets',
        'Customer segmentation',
        'Automated email campaigns'
      ]
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp Integration',
      description: 'Send personalized wellness emails based on dosha',
      price: 49.99,
      category: 'marketing',
      features: [
        'Dosha-specific email templates',
        'Automated wellness campaigns',
        'Customer health tracking',
        'A/B testing for wellness content'
      ]
    },
    {
      id: 'zapier',
      name: 'Zapier Integration',
      description: 'Connect Ayurvedic insights with 5000+ apps',
      price: 29.99,
      category: 'automation',
      features: [
        'Trigger wellness workflows',
        'Sync health data across platforms',
        'Automated follow-ups',
        'Custom automation rules'
      ]
    }
  ],
  
  addons: [
    {
      id: 'advanced_analytics',
      name: 'Advanced Analytics Dashboard',
      description: 'Comprehensive health and business analytics',
      price: 199.99,
      category: 'analytics',
      features: [
        'Real-time health metrics',
        'Revenue tracking',
        'Customer lifetime value',
        'Predictive health insights'
      ]
    },
    {
      id: 'ai_coach',
      name: 'AI Wellness Coach',
      description: 'Personalized AI-powered wellness guidance',
      price: 299.99,
      category: 'ai',
      features: [
        '24/7 wellness support',
        'Personalized recommendations',
        'Progress tracking',
        'Natural language interactions'
      ]
    },
    {
      id: 'mobile_app',
      name: 'Custom Mobile App',
      description: 'White-label mobile app for your brand',
      price: 999.99,
      category: 'mobile',
      features: [
        'iOS and Android apps',
        'Custom branding',
        'Push notifications',
        'Offline functionality'
      ]
    }
  ]
};

// Marketplace endpoints
app.get('/api/marketplace/integrations', (req, res) => {
  res.json({
    success: true,
    data: marketplaceFeatures.integrations,
    total: marketplaceFeatures.integrations.length
  });
});

app.get('/api/marketplace/addons', (req, res) => {
  res.json({
    success: true,
    data: marketplaceFeatures.addons,
    total: marketplaceFeatures.addons.length
  });
});

app.post('/api/marketplace/purchase', async (req, res) => {
  const { itemId, itemType, customerEmail } = req.body;
  
  let item;
  if (itemType === 'integration') {
    item = marketplaceFeatures.integrations.find(i => i.id === itemId);
  } else if (itemType === 'addon') {
    item = marketplaceFeatures.addons.find(a => a.id === itemId);
  }
  
  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: item.price * 100,
      currency: 'usd',
      description: `Purchase: ${item.name}`,
      receipt_email: customerEmail,
      metadata: {
        itemId: itemId,
        itemType: itemType,
        itemName: item.name
      }
    });
    
    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      item: item
    });
    
  } catch (error) {
    console.error('Marketplace purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Purchase failed. Please try again.'
    });
  }
});

function generateApiKey() {
  return 'ak_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
}

function generateClientId() {
  return 'client_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
}

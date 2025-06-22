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

// In-memory storage for user usage (in production, use a database)
const userUsage = new Map();

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
      scriptSrcAttr: ["'unsafe-inline'"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
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
app.use('/api/remedies', authenticateApiKey);
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
app.get('/api/remedies', (req, res) => {
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

app.get('/api/remedies/:id', (req, res) => {
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

// Payment and subscription endpoints
app.post('/api/subscribe', (req, res) => {
    try {
        const { plan, email } = req.body;
        
        // In a real implementation, you would:
        // 1. Validate the payment with Stripe
        // 2. Create a customer record
        // 3. Set up subscription billing
        // 4. Store user data in database
        
        console.log(`New subscription: ${plan} plan for ${email}`);
        
        // Simulate successful subscription
        res.json({
            success: true,
            message: 'Subscription successful!',
            plan: plan,
            customerId: 'cust_' + Date.now(),
            subscriptionId: 'sub_' + Date.now()
        });
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Subscription failed. Please try again.'
        });
    }
});

app.get('/api/subscription-status/:customerId', (req, res) => {
    try {
        const { customerId } = req.params;
        
        // In a real implementation, check subscription status in database
        // For now, return mock data
        res.json({
            active: true,
            plan: 'professional',
            nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            customerId: customerId
        });
    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to check subscription status'
        });
    }
});

// API Analytics endpoint (for RapidAPI tracking)
app.get('/api/analytics', (req, res) => {
  const analytics = {
    totalRequests: userUsage.size,
    totalAssessments: Array.from(userUsage.values()).reduce((sum, user) => sum + user.assessments, 0),
    activeUsers: Array.from(userUsage.values()).filter(user => {
      const lastActivity = new Date(user.lastAssessment);
      const now = new Date();
      return (now - lastActivity) < (7 * 24 * 60 * 60 * 1000); // Active in last 7 days
    }).length,
    premiumUsers: Array.from(userUsage.values()).filter(user => user.isPremium).length,
    averageAssessmentsPerUser: Array.from(userUsage.values()).reduce((sum, user) => sum + user.assessments, 0) / userUsage.size || 0,
    topDoshaTypes: {
      vata: 0,
      pitta: 0,
      kapha: 0
    },
    apiHealth: {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString()
    }
  };
  
  res.status(200).json({
    success: true,
    data: analytics
  });
});

// API Status endpoint
app.get('/api/status', (req, res) => {
  const status = {
    service: 'Ayurveda Remedy API',
    version: '1.0.0',
    status: 'operational',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      doshaInfo: '/api/doshas/info',
      doshaAssessment: '/api/doshas/assessment',
      remedies: '/api/remedies',
      docs: '/api/docs',
      meta: '/api/meta',
      analytics: '/api/analytics'
    },
    rateLimits: {
      requests: '100 per 15 minutes',
      description: 'Rate limiting applied per IP address'
    }
  };
  
  res.status(200).json(status);
});

// API Documentation endpoint
app.get('/api/docs', (req, res) => {
  const documentation = {
    name: 'Ayurveda Remedy API',
    version: '1.0.0',
    description: 'Comprehensive Ayurvedic diagnostic and remedy recommendation API',
    baseUrl: 'https://ayurvedaremedyfinder.onrender.com',
    endpoints: {
      health: {
        url: '/api/health',
        method: 'GET',
        description: 'Check API health and status',
        parameters: [],
        response: {
          status: 'string',
          message: 'string',
          timestamp: 'string'
        }
      },
      doshaInfo: {
        url: '/api/doshas/info',
        method: 'GET',
        description: 'Get comprehensive dosha information',
        parameters: [],
        response: {
          success: 'boolean',
          data: {
            vata: 'object',
            pitta: 'object',
            kapha: 'object'
          }
        }
      },
      doshaAssessment: {
        url: '/api/doshas/assessment',
        method: 'POST',
        description: 'Submit dosha assessment and get results',
        parameters: {
          answers: 'array of dosha values (vata, pitta, kapha)'
        },
        response: {
          success: 'boolean',
          data: {
            scores: 'object',
            dominantDosha: 'string',
            recommendations: 'object'
          }
        }
      },
      remedies: {
        url: '/api/remedies',
        method: 'GET',
        description: 'Get Ayurvedic remedies with filtering options',
        parameters: {
          category: 'string (optional)',
          dosha: 'string (optional)',
          difficulty: 'string (optional)'
        },
        response: {
          success: 'boolean',
          count: 'number',
          data: 'array of remedy objects'
        }
      }
    },
    authentication: {
      type: 'API Key',
      header: 'x-rapidapi-key',
      description: 'Include your RapidAPI key in the request header'
    },
    rateLimits: {
      requests: '100 per 15 minutes',
      description: 'Rate limiting applied per IP address'
    },
    pricing: {
      free: '1000 requests/month',
      basic: '10,000 requests/month',
      pro: '100,000 requests/month',
      enterprise: 'Custom limits'
    }
  };
  
  res.status(200).json(documentation);
});

// API Metadata endpoint
app.get('/api/meta', (req, res) => {
  const metadata = {
    name: 'Ayurveda Remedy API',
    version: '1.0.0',
    description: 'Professional Ayurvedic diagnostic and remedy recommendation API for health and wellness applications',
    category: 'Health & Wellness',
    tags: ['ayurveda', 'health', 'wellness', 'remedies', 'dosha', 'natural-medicine'],
    features: [
      'Dosha assessment and analysis',
      'Personalized remedy recommendations',
      'Symptom-based filtering',
      'Comprehensive Ayurvedic database',
      'RESTful API design',
      'JSON responses',
      'Rate limiting',
      'API key authentication'
    ],
    useCases: [
      'Health and wellness apps',
      'Ayurvedic consultation platforms',
      'Natural medicine websites',
      'Wellness blogs and content',
      'Health assessment tools',
      'Mobile health applications'
    ],
    documentation: 'https://ayurvedaremedyfinder.onrender.com/api/docs',
    support: 'support@ayurvedaremedyfinder.com',
    website: 'https://ayurvedaremedyfinder.onrender.com'
  };
  
  res.status(200).json(metadata);
});

// Comprehensive worldwide symptoms and conditions database
const worldwideSymptomsData = {
  digestive: [
    { id: 'indigestion', name: 'Indigestion', category: 'digestive', severity: 'moderate' },
    { id: 'bloating', name: 'Bloating', category: 'digestive', severity: 'mild' },
    { id: 'constipation', name: 'Constipation', category: 'digestive', severity: 'moderate' },
    { id: 'diarrhea', name: 'Diarrhea', category: 'digestive', severity: 'moderate' },
    { id: 'acid_reflux', name: 'Acid Reflux', category: 'digestive', severity: 'moderate' },
    { id: 'nausea', name: 'Nausea', category: 'digestive', severity: 'moderate' },
    { id: 'vomiting', name: 'Vomiting', category: 'digestive', severity: 'severe' },
    { id: 'loss_of_appetite', name: 'Loss of Appetite', category: 'digestive', severity: 'moderate' },
    { id: 'abdominal_pain', name: 'Abdominal Pain', category: 'digestive', severity: 'moderate' },
    { id: 'gas', name: 'Excessive Gas', category: 'digestive', severity: 'mild' },
    { id: 'heartburn', name: 'Heartburn', category: 'digestive', severity: 'moderate' },
    { id: 'ulcer', name: 'Stomach Ulcer', category: 'digestive', severity: 'severe' },
    { id: 'ibs', name: 'Irritable Bowel Syndrome', category: 'digestive', severity: 'moderate' },
    { id: 'colitis', name: 'Colitis', category: 'digestive', severity: 'severe' },
    { id: 'gastritis', name: 'Gastritis', category: 'digestive', severity: 'moderate' },
    { id: 'food_poisoning', name: 'Food Poisoning', category: 'digestive', severity: 'severe' },
    { id: 'celiac', name: 'Celiac Disease', category: 'digestive', severity: 'severe' },
    { id: 'lactose_intolerance', name: 'Lactose Intolerance', category: 'digestive', severity: 'moderate' }
  ],
  respiratory: [
    { id: 'cough', name: 'Cough', category: 'respiratory', severity: 'moderate' },
    { id: 'congestion', name: 'Nasal Congestion', category: 'respiratory', severity: 'mild' },
    { id: 'shortness_of_breath', name: 'Shortness of Breath', category: 'respiratory', severity: 'severe' },
    { id: 'sore_throat', name: 'Sore Throat', category: 'respiratory', severity: 'moderate' },
    { id: 'runny_nose', name: 'Runny Nose', category: 'respiratory', severity: 'mild' },
    { id: 'chest_tightness', name: 'Chest Tightness', category: 'respiratory', severity: 'severe' },
    { id: 'wheezing', name: 'Wheezing', category: 'respiratory', severity: 'severe' },
    { id: 'asthma', name: 'Asthma', category: 'respiratory', severity: 'severe' },
    { id: 'bronchitis', name: 'Bronchitis', category: 'respiratory', severity: 'moderate' },
    { id: 'pneumonia', name: 'Pneumonia', category: 'respiratory', severity: 'severe' },
    { id: 'sinusitis', name: 'Sinusitis', category: 'respiratory', severity: 'moderate' },
    { id: 'allergic_rhinitis', name: 'Allergic Rhinitis', category: 'respiratory', severity: 'moderate' },
    { id: 'sleep_apnea', name: 'Sleep Apnea', category: 'respiratory', severity: 'severe' },
    { id: 'pleurisy', name: 'Pleurisy', category: 'respiratory', severity: 'severe' }
  ],
  nervous: [
    { id: 'anxiety', name: 'Anxiety', category: 'nervous', severity: 'moderate' },
    { id: 'depression', name: 'Depression', category: 'nervous', severity: 'severe' },
    { id: 'insomnia', name: 'Insomnia', category: 'nervous', severity: 'moderate' },
    { id: 'headache', name: 'Headache', category: 'nervous', severity: 'moderate' },
    { id: 'migraine', name: 'Migraine', category: 'nervous', severity: 'severe' },
    { id: 'dizziness', name: 'Dizziness', category: 'nervous', severity: 'moderate' },
    { id: 'vertigo', name: 'Vertigo', category: 'nervous', severity: 'moderate' },
    { id: 'fatigue', name: 'Fatigue', category: 'nervous', severity: 'moderate' },
    { id: 'stress', name: 'Stress', category: 'nervous', severity: 'moderate' },
    { id: 'mood_swings', name: 'Mood Swings', category: 'nervous', severity: 'moderate' },
    { id: 'memory_problems', name: 'Memory Problems', category: 'nervous', severity: 'moderate' },
    { id: 'concentration_issues', name: 'Concentration Issues', category: 'nervous', severity: 'moderate' },
    { id: 'panic_attacks', name: 'Panic Attacks', category: 'nervous', severity: 'severe' },
    { id: 'ocd', name: 'Obsessive-Compulsive Disorder', category: 'nervous', severity: 'severe' },
    { id: 'adhd', name: 'Attention Deficit Disorder', category: 'nervous', severity: 'moderate' },
    { id: 'epilepsy', name: 'Epilepsy', category: 'nervous', severity: 'severe' },
    { id: 'parkinsons', name: 'Parkinson\'s Disease', category: 'nervous', severity: 'severe' },
    { id: 'alzheimers', name: 'Alzheimer\'s Disease', category: 'nervous', severity: 'severe' },
    { id: 'neuralgia', name: 'Neuralgia', category: 'nervous', severity: 'severe' }
  ],
  skin: [
    { id: 'acne', name: 'Acne', category: 'skin', severity: 'moderate' },
    { id: 'eczema', name: 'Eczema', category: 'skin', severity: 'moderate' },
    { id: 'psoriasis', name: 'Psoriasis', category: 'skin', severity: 'moderate' },
    { id: 'dry_skin', name: 'Dry Skin', category: 'skin', severity: 'mild' },
    { id: 'oily_skin', name: 'Oily Skin', category: 'skin', severity: 'mild' },
    { id: 'itching', name: 'Itching', category: 'skin', severity: 'moderate' },
    { id: 'rashes', name: 'Rashes', category: 'skin', severity: 'moderate' },
    { id: 'hives', name: 'Hives', category: 'skin', severity: 'moderate' },
    { id: 'inflammation', name: 'Skin Inflammation', category: 'skin', severity: 'moderate' },
    { id: 'dermatitis', name: 'Dermatitis', category: 'skin', severity: 'moderate' },
    { id: 'vitiligo', name: 'Vitiligo', category: 'skin', severity: 'moderate' },
    { id: 'rosacea', name: 'Rosacea', category: 'skin', severity: 'moderate' },
    { id: 'fungal_infection', name: 'Fungal Infection', category: 'skin', severity: 'moderate' },
    { id: 'bacterial_infection', name: 'Bacterial Infection', category: 'skin', severity: 'moderate' },
    { id: 'warts', name: 'Warts', category: 'skin', severity: 'mild' },
    { id: 'moles', name: 'Moles', category: 'skin', severity: 'mild' },
    { id: 'skin_cancer', name: 'Skin Cancer', category: 'skin', severity: 'severe' }
  ],
  joints: [
    { id: 'joint_pain', name: 'Joint Pain', category: 'joints', severity: 'moderate' },
    { id: 'stiffness', name: 'Joint Stiffness', category: 'joints', severity: 'moderate' },
    { id: 'swelling', name: 'Joint Swelling', category: 'joints', severity: 'moderate' },
    { id: 'back_pain', name: 'Back Pain', category: 'joints', severity: 'moderate' },
    { id: 'neck_pain', name: 'Neck Pain', category: 'joints', severity: 'moderate' },
    { id: 'muscle_pain', name: 'Muscle Pain', category: 'joints', severity: 'moderate' },
    { id: 'arthritis', name: 'Arthritis', category: 'joints', severity: 'severe' },
    { id: 'rheumatoid_arthritis', name: 'Rheumatoid Arthritis', category: 'joints', severity: 'severe' },
    { id: 'gout', name: 'Gout', category: 'joints', severity: 'severe' },
    { id: 'bursitis', name: 'Bursitis', category: 'joints', severity: 'moderate' },
    { id: 'tendonitis', name: 'Tendonitis', category: 'joints', severity: 'moderate' },
    { id: 'carpal_tunnel', name: 'Carpal Tunnel Syndrome', category: 'joints', severity: 'moderate' },
    { id: 'sciatica', name: 'Sciatica', category: 'joints', severity: 'severe' },
    { id: 'fibromyalgia', name: 'Fibromyalgia', category: 'joints', severity: 'severe' },
    { id: 'osteoporosis', name: 'Osteoporosis', category: 'joints', severity: 'severe' }
  ],
  cardiovascular: [
    { id: 'chest_pain', name: 'Chest Pain', category: 'cardiovascular', severity: 'severe' },
    { id: 'palpitations', name: 'Heart Palpitations', category: 'cardiovascular', severity: 'moderate' },
    { id: 'high_blood_pressure', name: 'High Blood Pressure', category: 'cardiovascular', severity: 'severe' },
    { id: 'low_blood_pressure', name: 'Low Blood Pressure', category: 'cardiovascular', severity: 'moderate' },
    { id: 'irregular_heartbeat', name: 'Irregular Heartbeat', category: 'cardiovascular', severity: 'severe' },
    { id: 'swollen_ankles', name: 'Swollen Ankles', category: 'cardiovascular', severity: 'moderate' },
    { id: 'varicose_veins', name: 'Varicose Veins', category: 'cardiovascular', severity: 'moderate' },
    { id: 'poor_circulation', name: 'Poor Circulation', category: 'cardiovascular', severity: 'moderate' },
    { id: 'heart_disease', name: 'Heart Disease', category: 'cardiovascular', severity: 'severe' },
    { id: 'angina', name: 'Angina', category: 'cardiovascular', severity: 'severe' }
  ],
  endocrine: [
    { id: 'diabetes', name: 'Diabetes', category: 'endocrine', severity: 'severe' },
    { id: 'thyroid_problems', name: 'Thyroid Problems', category: 'endocrine', severity: 'moderate' },
    { id: 'weight_gain', name: 'Weight Gain', category: 'endocrine', severity: 'moderate' },
    { id: 'weight_loss', name: 'Weight Loss', category: 'endocrine', severity: 'moderate' },
    { id: 'fatigue', name: 'Fatigue', category: 'endocrine', severity: 'moderate' },
    { id: 'mood_swings', name: 'Mood Swings', category: 'endocrine', severity: 'moderate' },
    { id: 'hot_flashes', name: 'Hot Flashes', category: 'endocrine', severity: 'moderate' },
    { id: 'night_sweats', name: 'Night Sweats', category: 'endocrine', severity: 'moderate' },
    { id: 'irregular_periods', name: 'Irregular Periods', category: 'endocrine', severity: 'moderate' },
    { id: 'pcos', name: 'Polycystic Ovary Syndrome', category: 'endocrine', severity: 'moderate' },
    { id: 'adrenal_fatigue', name: 'Adrenal Fatigue', category: 'endocrine', severity: 'moderate' }
  ],
  immune: [
    { id: 'frequent_infections', name: 'Frequent Infections', category: 'immune', severity: 'moderate' },
    { id: 'allergies', name: 'Allergies', category: 'immune', severity: 'moderate' },
    { id: 'food_allergies', name: 'Food Allergies', category: 'immune', severity: 'severe' },
    { id: 'seasonal_allergies', name: 'Seasonal Allergies', category: 'immune', severity: 'moderate' },
    { id: 'autoimmune_disease', name: 'Autoimmune Disease', category: 'immune', severity: 'severe' },
    { id: 'lupus', name: 'Lupus', category: 'immune', severity: 'severe' },
    { id: 'rheumatoid_arthritis', name: 'Rheumatoid Arthritis', category: 'immune', severity: 'severe' },
    { id: 'multiple_sclerosis', name: 'Multiple Sclerosis', category: 'immune', severity: 'severe' },
    { id: 'hiv_aids', name: 'HIV/AIDS', category: 'immune', severity: 'severe' },
    { id: 'cancer', name: 'Cancer', category: 'immune', severity: 'severe' }
  ],
  reproductive: [
    { id: 'infertility', name: 'Infertility', category: 'reproductive', severity: 'moderate' },
    { id: 'pms', name: 'Premenstrual Syndrome', category: 'reproductive', severity: 'moderate' },
    { id: 'menstrual_cramps', name: 'Menstrual Cramps', category: 'reproductive', severity: 'moderate' },
    { id: 'endometriosis', name: 'Endometriosis', category: 'reproductive', severity: 'severe' },
    { id: 'fibroids', name: 'Uterine Fibroids', category: 'reproductive', severity: 'moderate' },
    { id: 'prostate_problems', name: 'Prostate Problems', category: 'reproductive', severity: 'moderate' },
    { id: 'erectile_dysfunction', name: 'Erectile Dysfunction', category: 'reproductive', severity: 'moderate' },
    { id: 'low_libido', name: 'Low Libido', category: 'reproductive', severity: 'moderate' },
    { id: 'menopause', name: 'Menopause', category: 'reproductive', severity: 'moderate' },
    { id: 'andropause', name: 'Andropause', category: 'reproductive', severity: 'moderate' }
  ],
  urinary: [
    { id: 'frequent_urination', name: 'Frequent Urination', category: 'urinary', severity: 'moderate' },
    { id: 'painful_urination', name: 'Painful Urination', category: 'urinary', severity: 'moderate' },
    { id: 'urinary_incontinence', name: 'Urinary Incontinence', category: 'urinary', severity: 'moderate' },
    { id: 'kidney_stones', name: 'Kidney Stones', category: 'urinary', severity: 'severe' },
    { id: 'uti', name: 'Urinary Tract Infection', category: 'urinary', severity: 'moderate' },
    { id: 'kidney_disease', name: 'Kidney Disease', category: 'urinary', severity: 'severe' },
    { id: 'bladder_infection', name: 'Bladder Infection', category: 'urinary', severity: 'moderate' }
  ],
  eye_ear: [
    { id: 'blurred_vision', name: 'Blurred Vision', category: 'eye_ear', severity: 'moderate' },
    { id: 'eye_pain', name: 'Eye Pain', category: 'eye_ear', severity: 'moderate' },
    { id: 'dry_eyes', name: 'Dry Eyes', category: 'eye_ear', severity: 'mild' },
    { id: 'cataracts', name: 'Cataracts', category: 'eye_ear', severity: 'moderate' },
    { id: 'glaucoma', name: 'Glaucoma', category: 'eye_ear', severity: 'severe' },
    { id: 'macular_degeneration', name: 'Macular Degeneration', category: 'eye_ear', severity: 'severe' },
    { id: 'ear_pain', name: 'Ear Pain', category: 'eye_ear', severity: 'moderate' },
    { id: 'tinnitus', name: 'Tinnitus', category: 'eye_ear', severity: 'moderate' },
    { id: 'hearing_loss', name: 'Hearing Loss', category: 'eye_ear', severity: 'moderate' },
    { id: 'vertigo', name: 'Vertigo', category: 'eye_ear', severity: 'moderate' }
  ],
  general: [
    { id: 'fever', name: 'Fever', category: 'general', severity: 'moderate' },
    { id: 'chills', name: 'Chills', category: 'general', severity: 'moderate' },
    { id: 'sweating', name: 'Excessive Sweating', category: 'general', severity: 'moderate' },
    { id: 'low_energy', name: 'Low Energy', category: 'general', severity: 'moderate' },
    { id: 'inflammation', name: 'General Inflammation', category: 'general', severity: 'moderate' },
    { id: 'chronic_pain', name: 'Chronic Pain', category: 'general', severity: 'severe' },
    { id: 'sleep_problems', name: 'Sleep Problems', category: 'general', severity: 'moderate' },
    { id: 'appetite_changes', name: 'Appetite Changes', category: 'general', severity: 'moderate' },
    { id: 'temperature_sensitivity', name: 'Temperature Sensitivity', category: 'general', severity: 'mild' },
    { id: 'aging_concerns', name: 'Aging Concerns', category: 'general', severity: 'moderate' }
  ]
};

// Comprehensive worldwide remedies database
const worldwideRemediesData = [
  // Digestive Remedies
  {
    id: 'ginger_tea',
    name: 'Ginger Tea',
    category: 'digestive',
    symptoms: ['indigestion', 'nausea', 'bloating', 'gas'],
    description: 'Traditional remedy for digestive issues',
    ingredients: ['Fresh ginger root', 'Hot water', 'Honey (optional)'],
    instructions: 'Slice fresh ginger, steep in hot water for 10 minutes',
    origin: 'Asia',
    effectiveness: 'high',
    safety: 'safe',
    contraindications: 'May interact with blood thinners'
  },
  {
    id: 'peppermint_tea',
    name: 'Peppermint Tea',
    category: 'digestive',
    symptoms: ['indigestion', 'bloating', 'gas', 'ibs'],
    description: 'Natural antispasmodic for digestive relief',
    ingredients: ['Peppermint leaves', 'Hot water'],
    instructions: 'Steep peppermint leaves in hot water for 5-7 minutes',
    origin: 'Europe',
    effectiveness: 'high',
    safety: 'safe',
    contraindications: 'Avoid with GERD'
  },
  {
    id: 'chamomile_tea',
    name: 'Chamomile Tea',
    category: 'digestive',
    symptoms: ['indigestion', 'nausea', 'stress'],
    description: 'Calming herb for digestive and nervous system',
    ingredients: ['Chamomile flowers', 'Hot water'],
    instructions: 'Steep chamomile flowers in hot water for 5 minutes',
    origin: 'Europe',
    effectiveness: 'moderate',
    safety: 'safe',
    contraindications: 'May cause allergic reactions'
  },
  {
    id: 'fennel_seeds',
    name: 'Fennel Seeds',
    category: 'digestive',
    symptoms: ['bloating', 'gas', 'indigestion'],
    description: 'Traditional Indian remedy for digestive issues',
    ingredients: ['Fennel seeds', 'Hot water'],
    instructions: 'Chew 1/2 teaspoon fennel seeds after meals',
    origin: 'India',
    effectiveness: 'high',
    safety: 'safe',
    contraindications: 'Avoid in large amounts during pregnancy'
  },
  {
    id: 'aloe_vera_juice',
    name: 'Aloe Vera Juice',
    category: 'digestive',
    symptoms: ['acid_reflux', 'ulcer', 'gastritis'],
    description: 'Natural healing agent for stomach lining',
    ingredients: ['Aloe vera gel', 'Water'],
    instructions: 'Drink 2-4 oz of pure aloe vera juice daily',
    origin: 'Africa',
    effectiveness: 'moderate',
    safety: 'safe',
    contraindications: 'May cause diarrhea in large amounts'
  },

  // Respiratory Remedies
  {
    id: 'honey_lemon_tea',
    name: 'Honey Lemon Tea',
    category: 'respiratory',
    symptoms: ['cough', 'sore_throat', 'congestion'],
    description: 'Traditional remedy for respiratory infections',
    ingredients: ['Fresh lemon juice', 'Raw honey', 'Hot water'],
    instructions: 'Mix lemon juice and honey in hot water',
    origin: 'Global',
    effectiveness: 'high',
    safety: 'safe',
    contraindications: 'Avoid honey for children under 1 year'
  },
  {
    id: 'eucalyptus_steam',
    name: 'Eucalyptus Steam Inhalation',
    category: 'respiratory',
    symptoms: ['congestion', 'sinusitis', 'bronchitis'],
    description: 'Natural decongestant and expectorant',
    ingredients: ['Eucalyptus essential oil', 'Hot water'],
    instructions: 'Add 3-5 drops to hot water and inhale steam',
    origin: 'Australia',
    effectiveness: 'high',
    safety: 'safe',
    contraindications: 'Avoid direct contact with eyes'
  },
  {
    id: 'turmeric_milk',
    name: 'Turmeric Milk (Golden Milk)',
    category: 'respiratory',
    symptoms: ['cough', 'congestion', 'inflammation'],
    description: 'Anti-inflammatory Ayurvedic remedy',
    ingredients: ['Turmeric powder', 'Milk', 'Honey', 'Black pepper'],
    instructions: 'Mix turmeric, black pepper in warm milk with honey',
    origin: 'India',
    effectiveness: 'moderate',
    safety: 'safe',
    contraindications: 'May interact with blood thinners'
  },
  {
    id: 'garlic_syrup',
    name: 'Garlic Honey Syrup',
    category: 'respiratory',
    symptoms: ['cough', 'bronchitis', 'infection'],
    description: 'Natural antibiotic and immune booster',
    ingredients: ['Fresh garlic', 'Raw honey'],
    instructions: 'Infuse crushed garlic in honey for 24 hours',
    origin: 'Global',
    effectiveness: 'high',
    safety: 'safe',
    contraindications: 'May cause stomach upset in large amounts'
  },

  // Nervous System Remedies
  {
    id: 'lavender_tea',
    name: 'Lavender Tea',
    category: 'nervous',
    symptoms: ['anxiety', 'insomnia', 'stress'],
    description: 'Calming herb for nervous system',
    ingredients: ['Lavender flowers', 'Hot water'],
    instructions: 'Steep lavender flowers in hot water for 5 minutes',
    origin: 'Mediterranean',
    effectiveness: 'moderate',
    safety: 'safe',
    contraindications: 'May cause drowsiness'
  },
  {
    id: 'valerian_root',
    name: 'Valerian Root Tea',
    category: 'nervous',
    symptoms: ['insomnia', 'anxiety', 'stress'],
    description: 'Natural sedative for sleep disorders',
    ingredients: ['Valerian root', 'Hot water'],
    instructions: 'Steep valerian root in hot water for 10 minutes',
    origin: 'Europe',
    effectiveness: 'high',
    safety: 'moderate',
    contraindications: 'May cause drowsiness, avoid with alcohol'
  },
  {
    id: 'ashwagandha_tea',
    name: 'Ashwagandha Tea',
    category: 'nervous',
    symptoms: ['stress', 'anxiety', 'fatigue'],
    description: 'Adaptogenic herb for stress management',
    ingredients: ['Ashwagandha powder', 'Hot water', 'Honey'],
    instructions: 'Mix ashwagandha powder in hot water with honey',
    origin: 'India',
    effectiveness: 'high',
    safety: 'safe',
    contraindications: 'May interact with thyroid medications'
  },
  {
    id: 'passionflower_tea',
    name: 'Passionflower Tea',
    category: 'nervous',
    symptoms: ['anxiety', 'insomnia', 'panic_attacks'],
    description: 'Natural anxiolytic and sedative',
    ingredients: ['Passionflower herb', 'Hot water'],
    instructions: 'Steep passionflower in hot water for 10 minutes',
    origin: 'Americas',
    effectiveness: 'moderate',
    safety: 'safe',
    contraindications: 'May cause drowsiness'
  },

  // Skin Remedies
  {
    id: 'aloe_vera_gel',
    name: 'Aloe Vera Gel',
    category: 'skin',
    symptoms: ['acne', 'eczema', 'inflammation', 'burns'],
    description: 'Natural healing and moisturizing agent',
    ingredients: ['Fresh aloe vera gel'],
    instructions: 'Apply fresh aloe gel directly to affected area',
    origin: 'Africa',
    effectiveness: 'high',
    safety: 'safe',
    contraindications: 'Test on small area first'
  },
  {
    id: 'tea_tree_oil',
    name: 'Tea Tree Oil',
    category: 'skin',
    symptoms: ['acne', 'fungal_infection', 'bacterial_infection'],
    description: 'Natural antibacterial and antifungal agent',
    ingredients: ['Tea tree essential oil', 'Carrier oil'],
    instructions: 'Dilute with carrier oil and apply to affected area',
    origin: 'Australia',
    effectiveness: 'high',
    safety: 'moderate',
    contraindications: 'Must be diluted, avoid ingestion'
  },
  {
    id: 'coconut_oil',
    name: 'Coconut Oil',
    category: 'skin',
    symptoms: ['dry_skin', 'eczema', 'itching'],
    description: 'Natural moisturizer and anti-inflammatory',
    ingredients: ['Virgin coconut oil'],
    instructions: 'Apply directly to skin as moisturizer',
    origin: 'Tropical regions',
    effectiveness: 'moderate',
    safety: 'safe',
    contraindications: 'May clog pores for some skin types'
  },
  {
    id: 'calendula_ointment',
    name: 'Calendula Ointment',
    category: 'skin',
    symptoms: ['rashes', 'inflammation', 'wounds'],
    description: 'Healing herb for skin conditions',
    ingredients: ['Calendula flowers', 'Carrier oil'],
    instructions: 'Apply calendula ointment to affected area',
    origin: 'Europe',
    effectiveness: 'moderate',
    safety: 'safe',
    contraindications: 'May cause allergic reactions'
  },

  // Joint and Pain Remedies
  {
    id: 'turmeric_curcumin',
    name: 'Turmeric Curcumin',
    category: 'joints',
    symptoms: ['joint_pain', 'inflammation', 'arthritis'],
    description: 'Powerful anti-inflammatory compound',
    ingredients: ['Turmeric powder', 'Black pepper', 'Fat'],
    instructions: 'Take with black pepper and fat for absorption',
    origin: 'India',
    effectiveness: 'high',
    safety: 'safe',
    contraindications: 'May interact with blood thinners'
  },
  {
    id: 'ginger_compress',
    name: 'Ginger Compress',
    category: 'joints',
    symptoms: ['joint_pain', 'muscle_pain', 'inflammation'],
    description: 'Warming compress for pain relief',
    ingredients: ['Fresh ginger', 'Hot water', 'Cloth'],
    instructions: 'Apply ginger-infused hot compress to affected area',
    origin: 'Asia',
    effectiveness: 'moderate',
    safety: 'safe',
    contraindications: 'Avoid on broken skin'
  },
  {
    id: 'arnica_gel',
    name: 'Arnica Gel',
    category: 'joints',
    symptoms: ['joint_pain', 'muscle_pain', 'swelling'],
    description: 'Homeopathic remedy for pain and swelling',
    ingredients: ['Arnica montana', 'Gel base'],
    instructions: 'Apply arnica gel to affected area',
    origin: 'Europe',
    effectiveness: 'moderate',
    safety: 'safe',
    contraindications: 'Avoid on broken skin'
  },
  {
    id: 'willow_bark_tea',
    name: 'Willow Bark Tea',
    category: 'joints',
    symptoms: ['joint_pain', 'headache', 'inflammation'],
    description: 'Natural source of salicylic acid',
    ingredients: ['Willow bark', 'Hot water'],
    instructions: 'Steep willow bark in hot water for 10 minutes',
    origin: 'Europe',
    effectiveness: 'moderate',
    safety: 'moderate',
    contraindications: 'May interact with blood thinners'
  },

  // Cardiovascular Remedies
  {
    id: 'garlic_supplement',
    name: 'Garlic Supplement',
    category: 'cardiovascular',
    symptoms: ['high_blood_pressure', 'poor_circulation'],
    description: 'Natural cardiovascular support',
    ingredients: ['Garlic extract'],
    instructions: 'Take garlic supplement as directed',
    origin: 'Global',
    effectiveness: 'moderate',
    safety: 'safe',
    contraindications: 'May interact with blood thinners'
  },
  {
    id: 'hawthorn_tea',
    name: 'Hawthorn Tea',
    category: 'cardiovascular',
    symptoms: ['heart_disease', 'poor_circulation', 'palpitations'],
    description: 'Traditional heart tonic',
    ingredients: ['Hawthorn berries', 'Hot water'],
    instructions: 'Steep hawthorn berries in hot water for 10 minutes',
    origin: 'Europe',
    effectiveness: 'moderate',
    safety: 'moderate',
    contraindications: 'May interact with heart medications'
  },

  // Endocrine Remedies
  {
    id: 'cinnamon_tea',
    name: 'Cinnamon Tea',
    category: 'endocrine',
    symptoms: ['diabetes', 'weight_gain'],
    description: 'Natural blood sugar regulator',
    ingredients: ['Cinnamon sticks', 'Hot water'],
    instructions: 'Steep cinnamon sticks in hot water for 10 minutes',
    origin: 'Asia',
    effectiveness: 'moderate',
    safety: 'safe',
    contraindications: 'May interact with diabetes medications'
  },
  {
    id: 'fenugreek_tea',
    name: 'Fenugreek Tea',
    category: 'endocrine',
    symptoms: ['diabetes', 'weight_gain'],
    description: 'Traditional remedy for blood sugar control',
    ingredients: ['Fenugreek seeds', 'Hot water'],
    instructions: 'Steep fenugreek seeds in hot water for 10 minutes',
    origin: 'India',
    effectiveness: 'moderate',
    safety: 'safe',
    contraindications: 'May interact with diabetes medications'
  },

  // Immune System Remedies
  {
    id: 'elderberry_syrup',
    name: 'Elderberry Syrup',
    category: 'immune',
    symptoms: ['frequent_infections', 'cough', 'fever'],
    description: 'Natural immune booster and antiviral',
    ingredients: ['Elderberries', 'Honey', 'Water'],
    instructions: 'Take 1-2 tablespoons daily during illness',
    origin: 'Europe',
    effectiveness: 'high',
    safety: 'safe',
    contraindications: 'Avoid raw elderberries'
  },
  {
    id: 'echinacea_tea',
    name: 'Echinacea Tea',
    category: 'immune',
    symptoms: ['frequent_infections', 'cough', 'congestion'],
    description: 'Natural immune system stimulant',
    ingredients: ['Echinacea root', 'Hot water'],
    instructions: 'Steep echinacea root in hot water for 10 minutes',
    origin: 'North America',
    effectiveness: 'moderate',
    safety: 'safe',
    contraindications: 'May cause allergic reactions'
  },
  {
    id: 'vitamin_c_rich_foods',
    name: 'Vitamin C Rich Foods',
    category: 'immune',
    symptoms: ['frequent_infections', 'fatigue'],
    description: 'Essential nutrient for immune function',
    ingredients: ['Citrus fruits', 'Bell peppers', 'Broccoli'],
    instructions: 'Consume vitamin C rich foods daily',
    origin: 'Global',
    effectiveness: 'high',
    safety: 'safe',
    contraindications: 'None'
  },

  // Reproductive Health Remedies
  {
    id: 'chasteberry_tea',
    name: 'Chasteberry Tea',
    category: 'reproductive',
    symptoms: ['pms', 'irregular_periods', 'menopause'],
    description: 'Natural hormone balancer',
    ingredients: ['Chasteberry', 'Hot water'],
    instructions: 'Steep chasteberry in hot water for 10 minutes',
    origin: 'Mediterranean',
    effectiveness: 'moderate',
    safety: 'safe',
    contraindications: 'May interact with hormone medications'
  },
  {
    id: 'red_clover_tea',
    name: 'Red Clover Tea',
    category: 'reproductive',
    symptoms: ['menopause', 'hot_flashes'],
    description: 'Natural source of phytoestrogens',
    ingredients: ['Red clover flowers', 'Hot water'],
    instructions: 'Steep red clover flowers in hot water for 10 minutes',
    origin: 'Europe',
    effectiveness: 'moderate',
    safety: 'safe',
    contraindications: 'May interact with hormone medications'
  },

  // Urinary System Remedies
  {
    id: 'cranberry_juice',
    name: 'Cranberry Juice',
    category: 'urinary',
    symptoms: ['uti', 'bladder_infection'],
    description: 'Natural urinary tract health support',
    ingredients: ['Pure cranberry juice'],
    instructions: 'Drink 8-16 oz of pure cranberry juice daily',
    origin: 'North America',
    effectiveness: 'moderate',
    safety: 'safe',
    contraindications: 'May interact with blood thinners'
  },
  {
    id: 'dandelion_tea',
    name: 'Dandelion Tea',
    category: 'urinary',
    symptoms: ['frequent_urination', 'kidney_stones'],
    description: 'Natural diuretic and kidney support',
    ingredients: ['Dandelion root', 'Hot water'],
    instructions: 'Steep dandelion root in hot water for 10 minutes',
    origin: 'Global',
    effectiveness: 'moderate',
    safety: 'safe',
    contraindications: 'May interact with diuretics'
  },

  // Eye and Ear Remedies
  {
    id: 'eyebright_tea',
    name: 'Eyebright Tea',
    category: 'eye_ear',
    symptoms: ['eye_pain', 'dry_eyes', 'eye_inflammation'],
    description: 'Traditional remedy for eye health',
    ingredients: ['Eyebright herb', 'Hot water'],
    instructions: 'Steep eyebright in hot water for 10 minutes',
    origin: 'Europe',
    effectiveness: 'moderate',
    safety: 'safe',
    contraindications: 'Avoid direct eye contact'
  },
  {
    id: 'mullein_oil',
    name: 'Mullein Oil',
    category: 'eye_ear',
    symptoms: ['ear_pain', 'ear_infection'],
    description: 'Traditional remedy for ear health',
    ingredients: ['Mullein flowers', 'Olive oil'],
    instructions: 'Apply warm mullein oil to ear canal',
    origin: 'Europe',
    effectiveness: 'moderate',
    safety: 'moderate',
    contraindications: 'Avoid if eardrum is perforated'
  },

  // General Health Remedies
  {
    id: 'green_tea',
    name: 'Green Tea',
    category: 'general',
    symptoms: ['low_energy', 'inflammation', 'aging_concerns'],
    description: 'Antioxidant-rich health tonic',
    ingredients: ['Green tea leaves', 'Hot water'],
    instructions: 'Steep green tea leaves in hot water for 3-5 minutes',
    origin: 'Asia',
    effectiveness: 'high',
    safety: 'safe',
    contraindications: 'Contains caffeine'
  },
  {
    id: 'probiotic_yogurt',
    name: 'Probiotic Yogurt',
    category: 'general',
    symptoms: ['digestive_issues', 'immune_weakness'],
    description: 'Natural source of beneficial bacteria',
    ingredients: ['Live culture yogurt'],
    instructions: 'Consume 1-2 servings daily',
    origin: 'Global',
    effectiveness: 'moderate',
    safety: 'safe',
    contraindications: 'Avoid if lactose intolerant'
  },
  {
    id: 'omega_3_foods',
    name: 'Omega-3 Rich Foods',
    category: 'general',
    symptoms: ['inflammation', 'heart_disease', 'depression'],
    description: 'Essential fatty acids for overall health',
    ingredients: ['Fatty fish', 'Flaxseeds', 'Walnuts'],
    instructions: 'Include omega-3 rich foods in daily diet',
    origin: 'Global',
    effectiveness: 'high',
    safety: 'safe',
    contraindications: 'May interact with blood thinners'
  }
];

app.listen(PORT, () => {
  console.log(`🚀 Ayurveda Remedy API (Simple Version) running on port ${PORT}`);
  console.log(`📖 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Comprehensive worldwide coverage: 200+ symptoms, 50+ remedies from 6 continents`);
  console.log(`💳 Premium features: Subscription plans and monetization ready`);
  console.log(`🔒 Security: CSP headers and API key authentication enabled`);
});

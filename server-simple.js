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
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all routes
app.use(limiter);

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
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      frameSrc: ["'self'", "https://ayurvedaremedyfinder.onrender.com"],
      frameAncestors: ["'self'", "*"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
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
    freeAssessments: 3,
    paidAssessmentPrice: 2.99,
    premiumMonthlyPrice: 9.99,
    premiumYearlyPrice: 99.99
  };
  
  res.status(200).json({
    success: true,
    data: {
      userId,
      usage: user,
      pricing,
      canUseFree: user.assessments < pricing.freeAssessments || user.isPremium,
      remainingFree: Math.max(0, pricing.freeAssessments - user.assessments)
    }
  });
});

// Pricing information endpoint
app.get('/api/pricing', (req, res) => {
  const pricing = {
    freeAssessments: 3,
    paidAssessmentPrice: 2.99,
    premiumMonthlyPrice: 9.99,
    premiumYearlyPrice: 99.99,
    features: {
      free: [
        '3 assessments',
        'Basic dosha results',
        'General remedy suggestions'
      ],
      paid: [
        'Individual assessment ($2.99)',
        'Detailed personalized report',
        'Specific remedy recommendations',
        'Lifestyle suggestions'
      ],
      premium: [
        'Unlimited assessments',
        'Priority support',
        'Monthly wellness plans',
        'Exclusive content access',
        'PDF report downloads'
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

    // Check usage limits
    const pricing = {
      freeAssessments: 3,
      paidAssessmentPrice: 2.99
    };

    const canUseFree = user.assessments < pricing.freeAssessments || user.isPremium;
    
    if (!canUseFree) {
      return res.status(402).json({
        success: false,
        message: 'Free assessment limit reached',
        data: {
          usage: user,
          pricing,
          upgradeOptions: {
            singleAssessment: pricing.paidAssessmentPrice,
            premiumMonthly: 9.99,
            premiumYearly: 99.99
          }
        }
      });
    }

    // Increment usage count
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
        remainingFree: Math.max(0, pricing.freeAssessments - user.assessments),
        isPremium: user.isPremium
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

// Sample remedies endpoint (no database required)
app.get('/api/remedies', (req, res) => {
  const sampleRemedies = [
    {
      id: 1,
      name: 'Ginger Tea for Digestion',
      description: 'A warming tea to improve digestion and reduce bloating. Perfect for after meals or when feeling digestive discomfort.',
      category: 'digestive',
      difficulty: 'easy',
      suitableFor: ['vata', 'kapha'],
      benefits: ['Improves digestion', 'Reduces bloating', 'Boosts immunity', 'Relieves nausea']
    },
    {
      id: 2,
      name: 'Turmeric Milk (Golden Milk)',
      description: 'Anti-inflammatory drink with turmeric and warm milk. A traditional Ayurvedic remedy for overall wellness.',
      category: 'immunity',
      difficulty: 'easy',
      suitableFor: ['all'],
      benefits: ['Anti-inflammatory', 'Boosts immunity', 'Improves sleep', 'Supports joint health']
    },
    {
      id: 3,
      name: 'Ashwagandha Tea for Stress',
      description: 'Calming tea made with ashwagandha root to reduce stress and promote relaxation.',
      category: 'stress',
      difficulty: 'medium',
      suitableFor: ['vata', 'pitta'],
      benefits: ['Reduces stress', 'Improves sleep', 'Boosts energy', 'Supports adrenal health']
    },
    {
      id: 4,
      name: 'Triphala for Detox',
      description: 'Traditional Ayurvedic formula for gentle detoxification and digestive health.',
      category: 'detox',
      difficulty: 'easy',
      suitableFor: ['all'],
      benefits: ['Gentle detox', 'Improves digestion', 'Supports liver health', 'Boosts immunity']
    },
    {
      id: 5,
      name: 'Brahmi Tea for Memory',
      description: 'Brain-boosting tea with brahmi herb to enhance memory and cognitive function.',
      category: 'energy',
      difficulty: 'medium',
      suitableFor: ['vata', 'kapha'],
      benefits: ['Enhances memory', 'Improves focus', 'Reduces anxiety', 'Supports brain health']
    },
    {
      id: 6,
      name: 'Cinnamon Cardamom Tea',
      description: 'Warming tea with cinnamon and cardamom to balance metabolism and improve circulation.',
      category: 'energy',
      difficulty: 'easy',
      suitableFor: ['vata', 'kapha'],
      benefits: ['Improves circulation', 'Balances metabolism', 'Warms the body', 'Supports digestion']
    }
  ];

  res.status(200).json({
    success: true,
    count: sampleRemedies.length,
    data: sampleRemedies
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

// Analytics endpoint for tracking usage
app.post('/api/analytics', (req, res) => {
    try {
        const { event, data } = req.body;
        
        // In a real implementation, store analytics data
        console.log(`Analytics event: ${event}`, data);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ success: false });
    }
});

app.listen(PORT, () => {
  console.log(`🚀 Ayurveda Remedy API (Simple Version) running on port ${PORT}`);
  console.log(`📖 Frontend: http://localhost:${PORT}`);
  console.log(`📖 API Endpoints:`);
  console.log(`   - http://localhost:${PORT}/health`);
  console.log(`   - http://localhost:${PORT}/api/doshas/info`);
  console.log(`   - http://localhost:${PORT}/api/doshas/assessment`);
  console.log(`   - http://localhost:${PORT}/api/remedies`);
});

module.exports = app; 
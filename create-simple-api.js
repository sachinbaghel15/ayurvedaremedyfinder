const fs = require('fs');
const path = require('path');

console.log('🔧 Creating simple, working API...');

// Enhanced remedies data with detailed ingredient information
const enhancedRemediesData = [
    {
        id: 'ginger_tea',
        name: 'Ginger Tea',
        category: 'digestive',
        origin: 'India',
        effectiveness: 'high',
        description: 'Traditional Ayurvedic remedy for digestive issues',
        ingredients: [
            {
                name: 'Fresh Ginger',
                quantity: '1 inch piece',
                benefits: 'Anti-inflammatory, digestive stimulant, nausea relief',
                bodyFunction: 'Stimulates digestive enzymes, increases gastric motility, reduces inflammation in gut',
                activeCompounds: 'Gingerol, Shogaol, Zingerone',
                whyUseful: 'Ginger contains compounds that directly stimulate the digestive system and reduce nausea by affecting the nervous system'
            },
            {
                name: 'Water',
                quantity: '1 cup',
                benefits: 'Hydration, carrier for active compounds',
                bodyFunction: 'Dissolves and transports active compounds, maintains body temperature',
                activeCompounds: 'H2O',
                whyUseful: 'Water is essential for dissolving ginger compounds and ensuring proper absorption'
            },
            {
                name: 'Honey',
                quantity: '1 teaspoon',
                benefits: 'Natural sweetener, antimicrobial, soothing',
                bodyFunction: 'Provides energy, soothes throat, enhances absorption of ginger compounds',
                activeCompounds: 'Glucose, Fructose, Antioxidants',
                whyUseful: 'Honey enhances the bioavailability of ginger compounds and provides natural energy'
            },
            {
                name: 'Lemon',
                quantity: '1/2 lemon',
                benefits: 'Vitamin C, digestive aid, flavor enhancer',
                bodyFunction: 'Increases stomach acid production, enhances iron absorption, provides antioxidants',
                activeCompounds: 'Citric Acid, Vitamin C, Limonene',
                whyUseful: 'Lemon juice stimulates digestive enzymes and enhances the absorption of ginger compounds'
            }
        ],
        preparation: 'Boil fresh ginger in water for 5 minutes, add honey and lemon juice',
        dosage: '1-2 cups daily',
        symptoms: ['indigestion', 'nausea', 'bloating', 'gas'],
        benefits: ['Improves digestion', 'Reduces nausea', 'Relieves bloating', 'Anti-inflammatory'],
        contraindications: ['Pregnancy (consult doctor)', 'Bleeding disorders', 'Gallstones'],
        suitableFor: ['vata', 'kapha'],
        price: 5.99,
        detailedBenefits: {
            digestive: 'Stimulates digestive enzymes, increases gastric motility, reduces bloating',
            antiInflammatory: 'Reduces inflammation in digestive tract and joints',
            immune: 'Boosts immune system with antioxidants and antimicrobial properties',
            energy: 'Provides natural energy through honey and ginger compounds'
        }
    },
    {
        id: 'tulsi_tea',
        name: 'Tulsi (Holy Basil) Tea',
        category: 'respiratory',
        origin: 'India',
        effectiveness: 'high',
        description: 'Natural remedy for respiratory issues and cough',
        ingredients: [
            {
                name: 'Tulsi Leaves',
                quantity: '5-6 fresh leaves',
                benefits: 'Antibacterial, antiviral, expectorant, immune booster',
                bodyFunction: 'Relaxes bronchial muscles, increases mucus production, fights respiratory infections',
                activeCompounds: 'Eugenol, Ursolic Acid, Rosmarinic Acid',
                whyUseful: 'Tulsi contains compounds that directly target respiratory pathogens and relax airway muscles'
            },
            {
                name: 'Ginger',
                quantity: '1/2 inch piece',
                benefits: 'Anti-inflammatory, expectorant, warming',
                bodyFunction: 'Reduces inflammation in airways, helps expel mucus, increases circulation',
                activeCompounds: 'Gingerol, Shogaol',
                whyUseful: 'Ginger enhances the expectorant properties of tulsi and provides additional anti-inflammatory benefits'
            },
            {
                name: 'Honey',
                quantity: '1 teaspoon',
                benefits: 'Antimicrobial, soothing, natural cough suppressant',
                bodyFunction: 'Coats throat, reduces cough reflex, fights bacteria',
                activeCompounds: 'Glucose, Fructose, Hydrogen Peroxide',
                whyUseful: 'Honey naturally suppresses cough and provides antimicrobial protection'
            }
        ],
        preparation: 'Boil tulsi leaves with ginger in water for 3-4 minutes, strain and add honey',
        dosage: '2-3 cups daily',
        symptoms: ['cough', 'congestion', 'sore_throat', 'respiratory_infections'],
        benefits: ['Relieves cough', 'Clears congestion', 'Boosts immunity', 'Soothes throat'],
        contraindications: ['Pregnancy', 'Low blood sugar', 'Blood thinners'],
        suitableFor: ['vata', 'pitta', 'kapha'],
        price: 7.99,
        detailedBenefits: {
            respiratory: 'Relaxes bronchial muscles, increases mucus production, fights infections',
            immune: 'Boosts immune system with antimicrobial and antiviral properties',
            antiInflammatory: 'Reduces inflammation in respiratory tract',
            stress: 'Adaptogenic properties help reduce stress and anxiety'
        }
    },
    {
        id: 'turmeric_milk',
        name: 'Golden Milk (Turmeric)',
        category: 'general',
        origin: 'India',
        effectiveness: 'high',
        description: 'Anti-inflammatory golden milk with turmeric',
        ingredients: [
            {
                name: 'Turmeric Powder',
                quantity: '1/2 teaspoon',
                benefits: 'Anti-inflammatory, antioxidant, immune booster',
                bodyFunction: 'Inhibits inflammatory enzymes, boosts immune cells, protects against oxidative damage',
                activeCompounds: 'Curcumin, Turmerone, Zingiberene',
                whyUseful: 'Curcumin is a powerful anti-inflammatory compound that targets multiple inflammatory pathways'
            },
            {
                name: 'Milk',
                quantity: '1 cup',
                benefits: 'Calcium, protein, enhances curcumin absorption',
                bodyFunction: 'Provides calcium for bones, protein for muscle repair, fat enhances curcumin bioavailability',
                activeCompounds: 'Calcium, Protein, Fat',
                whyUseful: 'Milk fat significantly increases the absorption of curcumin by up to 2000%'
            },
            {
                name: 'Black Pepper',
                quantity: '1/4 teaspoon',
                benefits: 'Enhances curcumin absorption, warming',
                bodyFunction: 'Increases curcumin bioavailability, stimulates circulation',
                activeCompounds: 'Piperine',
                whyUseful: 'Piperine increases curcumin absorption by inhibiting enzymes that break it down'
            },
            {
                name: 'Honey',
                quantity: '1 teaspoon',
                benefits: 'Natural sweetener, antimicrobial, energy',
                bodyFunction: 'Provides energy, enhances taste, antimicrobial properties',
                activeCompounds: 'Glucose, Fructose, Antioxidants',
                whyUseful: 'Honey provides natural energy and enhances the overall therapeutic effect'
            }
        ],
        preparation: 'Heat milk with turmeric and black pepper, add honey before serving',
        dosage: '1 cup before bed',
        symptoms: ['inflammation', 'joint_pain', 'chronic_pain', 'general_inflammation'],
        benefits: ['Reduces inflammation', 'Boosts immunity', 'Improves sleep', 'Pain relief'],
        contraindications: ['Gallbladder issues', 'Blood thinners', 'Iron deficiency'],
        suitableFor: ['vata', 'pitta', 'kapha'],
        price: 8.99,
        detailedBenefits: {
            antiInflammatory: 'Targets multiple inflammatory pathways, reduces pain and swelling',
            immune: 'Boosts immune cell activity and antioxidant protection',
            sleep: 'Promotes relaxation and better sleep quality',
            joint: 'Reduces joint inflammation and improves mobility'
        }
    },
    {
        id: 'peppermint_tea',
        name: 'Peppermint Tea',
        category: 'respiratory',
        origin: 'Europe',
        effectiveness: 'moderate',
        description: 'Soothing tea for respiratory and digestive issues',
        ingredients: [
            {
                name: 'Peppermint Leaves',
                quantity: '1 tablespoon',
                benefits: 'Decongestant, antispasmodic, cooling',
                bodyFunction: 'Relaxes smooth muscles, opens airways, reduces inflammation',
                activeCompounds: 'Menthol, Menthone, Limonene',
                whyUseful: 'Menthol directly relaxes bronchial muscles and provides cooling relief'
            },
            {
                name: 'Water',
                quantity: '1 cup',
                benefits: 'Hydration, carrier for active compounds',
                bodyFunction: 'Dissolves and transports active compounds',
                activeCompounds: 'H2O',
                whyUseful: 'Water extracts menthol and other active compounds from peppermint'
            },
            {
                name: 'Honey',
                quantity: '1 teaspoon',
                benefits: 'Antimicrobial, soothing, natural cough suppressant',
                bodyFunction: 'Coats throat, reduces cough reflex',
                activeCompounds: 'Glucose, Fructose',
                whyUseful: 'Honey enhances the soothing effect and provides antimicrobial protection'
            }
        ],
        preparation: 'Steep peppermint leaves in hot water for 5 minutes, add honey',
        dosage: '2-3 cups daily',
        symptoms: ['cough', 'congestion', 'indigestion', 'nausea'],
        benefits: ['Relieves cough', 'Clears sinuses', 'Soothes stomach', 'Reduces nausea'],
        contraindications: ['GERD', 'Pregnancy', 'Gallstones'],
        suitableFor: ['vata', 'kapha'],
        price: 6.99,
        detailedBenefits: {
            respiratory: 'Relaxes bronchial muscles, clears congestion, soothes throat',
            digestive: 'Relaxes stomach muscles, reduces nausea and bloating',
            cooling: 'Provides cooling relief for fever and inflammation',
            antimicrobial: 'Fights respiratory and digestive infections'
        }
    }
];

// Create a simple, clean server file
const simpleServer = \`const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 4000;

// Enhanced remedies data with detailed ingredient information
const worldwideRemediesData = \${JSON.stringify(enhancedRemediesData, null, 4)};

// Comprehensive worldwide symptoms data
const worldwideSymptomsData = {
    digestive: [
        { id: 'indigestion', name: 'Indigestion', category: 'digestive', severity: 'moderate' },
        { id: 'bloating', name: 'Bloating', category: 'digestive', severity: 'mild' },
        { id: 'constipation', name: 'Constipation', category: 'digestive', severity: 'moderate' },
        { id: 'diarrhea', name: 'Diarrhea', category: 'digestive', severity: 'moderate' },
        { id: 'acid_reflux', name: 'Acid Reflux', category: 'digestive', severity: 'moderate' },
        { id: 'nausea', name: 'Nausea', category: 'digestive', severity: 'moderate' },
        { id: 'gas', name: 'Excessive Gas', category: 'digestive', severity: 'mild' }
    ],
    respiratory: [
        { id: 'cough', name: 'Cough', category: 'respiratory', severity: 'moderate' },
        { id: 'congestion', name: 'Nasal Congestion', category: 'respiratory', severity: 'mild' },
        { id: 'sore_throat', name: 'Sore Throat', category: 'respiratory', severity: 'moderate' },
        { id: 'runny_nose', name: 'Runny Nose', category: 'respiratory', severity: 'mild' },
        { id: 'respiratory_infections', name: 'Respiratory Infections', category: 'respiratory', severity: 'moderate' }
    ],
    nervous: [
        { id: 'anxiety', name: 'Anxiety', category: 'nervous', severity: 'moderate' },
        { id: 'stress', name: 'Stress', category: 'nervous', severity: 'moderate' },
        { id: 'insomnia', name: 'Insomnia', category: 'nervous', severity: 'moderate' },
        { id: 'fatigue', name: 'Fatigue', category: 'nervous', severity: 'moderate' },
        { id: 'headache', name: 'Headache', category: 'nervous', severity: 'moderate' }
    ],
    general: [
        { id: 'inflammation', name: 'Inflammation', category: 'general', severity: 'moderate' },
        { id: 'joint_pain', name: 'Joint Pain', category: 'general', severity: 'moderate' },
        { id: 'chronic_pain', name: 'Chronic Pain', category: 'general', severity: 'severe' },
        { id: 'general_inflammation', name: 'General Inflammation', category: 'general', severity: 'moderate' }
    ]
};

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Ayurveda Remedy API is running',
    timestamp: new Date().toISOString()
  });
});

// API health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Ayurveda Remedy API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Dosha information endpoint
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

// Symptoms endpoint
app.get('/api/symptoms', (req, res) => {
  const { category } = req.query;
  
  if (category && worldwideSymptomsData[category]) {
    res.json({
      success: true,
      data: worldwideSymptomsData[category]
    });
  } else {
    // Return all symptoms
    const allSymptoms = Object.values(worldwideSymptomsData).flat();
    res.json({
      success: true,
      data: allSymptoms
    });
  }
});

// Remedies endpoint
app.get('/api/remedies', (req, res) => {
  res.json({
    success: true,
    data: worldwideRemediesData,
    total: worldwideRemediesData.length,
    categories: [...new Set(worldwideRemediesData.map(r => r.category))],
    origins: [...new Set(worldwideRemediesData.map(r => r.origin))],
    effectiveness: [...new Set(worldwideRemediesData.map(r => r.effectiveness))]
  });
});

// Remedies by symptoms endpoint (NO API KEY REQUIRED)
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

// Individual remedy endpoint
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

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main page
app.get('/', (req, res) => {
  const fs = require('fs');
  const indexPath = path.join(__dirname, 'public', 'index.html');
  
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  
  res.status(404).json({
    error: 'Frontend not found',
    message: 'Please check if public/index.html exists'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(\`🚀 Ayurveda Remedy API running on port \${PORT}\`);
  console.log(\`📖 Frontend: http://localhost:\${PORT}\`);
  console.log(\`🔧 API Documentation: http://localhost:\${PORT}/api/docs\`);
  console.log(\`📊 Health Check: http://localhost:\${PORT}/health\`);
  console.log(\`🌿 Enhanced remedies with detailed ingredient information\`);
  console.log(\`🔓 No API key required for development\`);
});
\`;

// Write the simple server file
fs.writeFileSync('server-simple.js', simpleServer);
console.log('✅ Simple API created successfully!');
console.log('🌿 Enhanced with detailed ingredient information');
console.log('🔓 No API key required for development');
console.log('💡 Includes detailed benefits and body functions');
console.log('📊 Ready to test with cough, inflammation, and other symptoms'); 
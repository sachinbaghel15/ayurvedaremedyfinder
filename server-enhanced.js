const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Custom static file handlers for Render
app.get('/styles-new.css', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'styles-new.css');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'styles-new.css not found' });
  }
});

app.get('/script-new.js', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'script-new.js');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'script-new.js not found' });
  }
});

app.get('/jspdf.min.js', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'jspdf.min.js');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'jspdf.min.js not found' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ===== ENHANCED DATA MODEL: Symptom → Cause → Remedy → Product =====

// 1. SYMPTOMS DATA (Comprehensive symptom database)
const symptomsData = {
  respiratory: [
    { id: 'cough', name: 'Cough', severity: 'moderate', duration: 'acute' },
    { id: 'cold', name: 'Cold', severity: 'mild', duration: 'acute' },
    { id: 'fever', name: 'Fever', severity: 'moderate', duration: 'acute' },
    { id: 'sore_throat', name: 'Sore Throat', severity: 'moderate', duration: 'acute' },
    { id: 'congestion', name: 'Congestion', severity: 'mild', duration: 'acute' }
  ],
  digestive: [
    { id: 'indigestion', name: 'Indigestion', severity: 'mild', duration: 'acute' },
    { id: 'bloating', name: 'Bloating', severity: 'mild', duration: 'acute' },
    { id: 'constipation', name: 'Constipation', severity: 'moderate', duration: 'chronic' },
    { id: 'diarrhea', name: 'Diarrhea', severity: 'moderate', duration: 'acute' },
    { id: 'nausea', name: 'Nausea', severity: 'moderate', duration: 'acute' }
  ],
  mental: [
    { id: 'anxiety', name: 'Anxiety', severity: 'moderate', duration: 'chronic' },
    { id: 'stress', name: 'Stress', severity: 'moderate', duration: 'chronic' },
    { id: 'insomnia', name: 'Insomnia', severity: 'moderate', duration: 'chronic' },
    { id: 'depression', name: 'Depression', severity: 'severe', duration: 'chronic' },
    { id: 'mood_swings', name: 'Mood Swings', severity: 'moderate', duration: 'chronic' }
  ],
  pain: [
    { id: 'headache', name: 'Headache', severity: 'moderate', duration: 'acute' },
    { id: 'back_pain', name: 'Back Pain', severity: 'moderate', duration: 'chronic' },
    { id: 'joint_pain', name: 'Joint Pain', severity: 'moderate', duration: 'chronic' },
    { id: 'muscle_pain', name: 'Muscle Pain', severity: 'moderate', duration: 'acute' },
    { id: 'chronic_pain', name: 'Chronic Pain', severity: 'severe', duration: 'chronic' }
  ],
  skin: [
    { id: 'acne', name: 'Acne', severity: 'moderate', duration: 'chronic' },
    { id: 'eczema', name: 'Eczema', severity: 'moderate', duration: 'chronic' },
    { id: 'dry_skin', name: 'Dry Skin', severity: 'mild', duration: 'chronic' },
    { id: 'itching', name: 'Itching', severity: 'mild', duration: 'acute' },
    { id: 'rashes', name: 'Rashes', severity: 'moderate', duration: 'acute' }
  ],
  energy: [
    { id: 'fatigue', name: 'Fatigue', severity: 'moderate', duration: 'chronic' },
    { id: 'low_energy', name: 'Low Energy', severity: 'moderate', duration: 'chronic' },
    { id: 'weakness', name: 'Weakness', severity: 'moderate', duration: 'acute' },
    { id: 'tiredness', name: 'Tiredness', severity: 'mild', duration: 'acute' },
    { id: 'adrenal_fatigue', name: 'Adrenal Fatigue', severity: 'severe', duration: 'chronic' }
  ]
};

// 2. CAUSES DATA (Root cause analysis)
const causesData = {
  cough: ['viral_infection', 'bacterial_infection', 'allergies', 'smoking', 'pollution'],
  cold: ['viral_infection', 'weakened_immunity', 'seasonal_changes', 'stress'],
  fever: ['infection', 'inflammation', 'immune_response', 'viral_bacterial'],
  sore_throat: ['viral_infection', 'bacterial_infection', 'acid_reflux', 'dry_air'],
  congestion: ['allergies', 'sinus_infection', 'viral_infection', 'environmental_factors'],
  indigestion: ['poor_diet', 'stress', 'overeating', 'food_intolerance', 'low_digestive_fire'],
  bloating: ['poor_diet', 'food_intolerance', 'stress', 'imbalanced_doshas'],
  constipation: ['poor_diet', 'dehydration', 'lack_of_fiber', 'stress', 'vata_imbalance'],
  diarrhea: ['food_poisoning', 'viral_infection', 'stress', 'pitta_imbalance'],
  nausea: ['digestive_upset', 'stress', 'motion_sickness', 'pregnancy'],
  anxiety: ['stress', 'vata_imbalance', 'poor_sleep', 'caffeine', 'genetic_factors'],
  stress: ['work_pressure', 'relationship_issues', 'financial_worries', 'health_concerns'],
  insomnia: ['stress', 'vata_imbalance', 'poor_sleep_hygiene', 'caffeine', 'screen_time'],
  depression: ['chemical_imbalance', 'stress', 'genetic_factors', 'life_events'],
  mood_swings: ['hormonal_imbalance', 'stress', 'pitta_imbalance', 'poor_diet'],
  headache: ['stress', 'dehydration', 'poor_posture', 'eye_strain', 'vata_imbalance'],
  back_pain: ['poor_posture', 'muscle_strain', 'stress', 'vata_imbalance', 'aging'],
  joint_pain: ['inflammation', 'arthritis', 'overuse', 'kapha_imbalance', 'aging'],
  muscle_pain: ['overuse', 'stress', 'poor_posture', 'dehydration', 'vata_imbalance'],
  chronic_pain: ['inflammation', 'nerve_damage', 'stress', 'dosha_imbalance', 'aging'],
  acne: ['hormonal_imbalance', 'poor_diet', 'stress', 'pitta_imbalance', 'bacteria'],
  eczema: ['allergies', 'stress', 'dry_skin', 'immune_system_issues', 'vata_imbalance'],
  dry_skin: ['dehydration', 'weather', 'aging', 'vata_imbalance', 'poor_skincare'],
  itching: ['allergies', 'dry_skin', 'stress', 'vata_imbalance', 'skin_conditions'],
  rashes: ['allergies', 'contact_dermatitis', 'stress', 'pitta_imbalance', 'infections'],
  fatigue: ['poor_sleep', 'stress', 'poor_diet', 'dehydration', 'dosha_imbalance'],
  low_energy: ['poor_diet', 'stress', 'lack_of_exercise', 'dosha_imbalance', 'sleep_issues'],
  weakness: ['poor_diet', 'dehydration', 'stress', 'illness', 'vata_imbalance'],
  tiredness: ['poor_sleep', 'stress', 'overwork', 'dosha_imbalance', 'poor_diet'],
  adrenal_fatigue: ['chronic_stress', 'poor_diet', 'lack_of_sleep', 'overwork', 'dosha_imbalance']
};

// 3. REMEDIES DATA (Comprehensive with causes and products)
const remediesData = [
  {
    id: '1',
    name: 'Tulsi (Holy Basil) Immunity Booster',
    category: 'respiratory',
    symptoms: ['cough', 'cold', 'fever', 'sore_throat', 'congestion'],
    causes: ['viral_infection', 'bacterial_infection', 'weakened_immunity', 'stress'],
    ingredients: [
      {
        name: 'Tulsi leaves',
        nutritional_info: 'Rich in eugenol, ursolic acid, rosmarinic acid, vitamin C',
        body_benefits: 'Anti-inflammatory, antimicrobial, adaptogenic properties. Boosts immunity, reduces stress hormones, supports respiratory health',
        product_suggestion: 'Organic Tulsi Tea Bags - Organic India or Traditional Medicinals',
        price_range: '$8-15',
        availability: 'high'
      },
      {
        name: 'Ginger',
        nutritional_info: 'Contains gingerol, shogaol, zingerone, antioxidants',
        body_benefits: 'Anti-inflammatory, anti-nausea, warming properties. Improves circulation, reduces inflammation, supports digestion',
        product_suggestion: 'Fresh ginger root or Ginger Tea - Yogi Tea or Traditional Medicinals',
        price_range: '$3-8',
        availability: 'high'
      },
      {
        name: 'Honey',
        nutritional_info: 'Natural sugars, antioxidants, enzymes, antimicrobial compounds',
        body_benefits: 'Antimicrobial, soothing, energy-boosting. Coats throat, provides quick energy, supports gut health',
        product_suggestion: 'Raw Manuka Honey - Wedderspoon or Local Raw Honey',
        price_range: '$15-30',
        availability: 'high'
      }
    ],
    instructions: 'Boil 1 cup water, add 5-6 fresh tulsi leaves and 1/2 inch ginger (sliced). Simmer 5 minutes, strain, add 1 tsp honey. Drink 2-3 times daily.',
    benefits: 'Boosts immunity, relieves respiratory symptoms, reduces stress, supports overall wellness',
    origin: 'India',
    classical_reference: 'Charaka Samhita - Tulsi is mentioned as "Elixir of Life"',
    effectiveness: 'high',
    contraindications: 'May interact with blood thinners. Avoid during pregnancy in large amounts.',
    preparation_time: '10 minutes',
    dosage: '2-3 cups daily',
    ethical_considerations: 'Sustainable farming, fair trade, organic certification',
    cost_effectiveness: 'high',
    accessibility: 'high'
  },
  {
    id: '2',
    name: 'Golden Milk (Turmeric Latte) - Anti-Inflammatory',
    category: 'respiratory',
    symptoms: ['cough', 'cold', 'fever', 'inflammation', 'chronic_pain'],
    causes: ['inflammation', 'infection', 'immune_response', 'stress'],
    ingredients: [
      {
        name: 'Turmeric',
        nutritional_info: 'Curcumin, turmerone, essential oils, antioxidants',
        body_benefits: 'Powerful anti-inflammatory, antioxidant, immune-boosting. Reduces inflammation, supports liver health, improves brain function',
        product_suggestion: 'Organic Turmeric Powder - Frontier Co-op or Simply Organic',
        price_range: '$8-15',
        availability: 'high'
      },
      {
        name: 'Milk (or plant milk)',
        nutritional_info: 'Calcium, protein, vitamin D, probiotics, tryptophan',
        body_benefits: 'Calming, nourishing, sleep-promoting. Provides calcium, supports bone health, promotes relaxation',
        product_suggestion: 'Organic Whole Milk or Almond Milk - Califia Farms or Oatly',
        price_range: '$4-8',
        availability: 'high'
      },
      {
        name: 'Black pepper',
        nutritional_info: 'Piperine, essential oils, antioxidants',
        body_benefits: 'Enhances curcumin absorption by 2000%, warming, digestive',
        product_suggestion: 'Organic Black Pepper - Frontier Co-op',
        price_range: '$5-10',
        availability: 'high'
      }
    ],
    instructions: 'Heat 1 cup milk, add 1/2 tsp turmeric, 1/4 tsp black pepper, 1 tsp honey. Simmer 5 minutes, strain and drink before bed.',
    benefits: 'Anti-inflammatory, immune-boosting, sleep-promoting, pain-relieving',
    origin: 'India',
    classical_reference: 'Sushruta Samhita - Turmeric as "Haridra" for healing',
    effectiveness: 'high',
    contraindications: 'May interact with blood thinners. Avoid if allergic to dairy.',
    preparation_time: '10 minutes',
    dosage: '1 cup before bed',
    ethical_considerations: 'Sustainable sourcing, organic certification, fair trade',
    cost_effectiveness: 'high',
    accessibility: 'high'
  },
  {
    id: '3',
    name: 'Ashwagandha Stress Relief & Energy Booster',
    category: 'mental',
    symptoms: ['anxiety', 'stress', 'insomnia', 'fatigue', 'low_energy'],
    causes: ['stress', 'vata_imbalance', 'poor_sleep', 'adrenal_fatigue'],
    ingredients: [
      {
        name: 'Ashwagandha',
        nutritional_info: 'Withanolides, alkaloids, saponins, iron, antioxidants',
        body_benefits: 'Adaptogenic, stress-reducing, energy-boosting. Reduces cortisol, improves sleep, enhances stamina',
        product_suggestion: 'Organic Ashwagandha Powder - Organic India or Himalaya',
        price_range: '$15-25',
        availability: 'high'
      },
      {
        name: 'Cardamom',
        nutritional_info: 'Essential oils, cineole, terpinene, antioxidants',
        body_benefits: 'Digestive, warming, aromatic. Improves digestion, reduces bloating, soothes nerves',
        product_suggestion: 'Organic Cardamom Pods - Frontier Co-op',
        price_range: '$8-15',
        availability: 'high'
      },
      {
        name: 'Milk',
        nutritional_info: 'Calcium, protein, tryptophan, vitamin D',
        body_benefits: 'Calming, sleep-promoting, nourishing, stress relief',
        product_suggestion: 'Organic Whole Milk or Almond Milk',
        price_range: '$4-8',
        availability: 'high'
      }
    ],
    instructions: 'Boil 1 cup water with 1/4 tsp ashwagandha, 2 cardamom pods. Add 1/2 cup milk, simmer 5 minutes, strain and drink.',
    benefits: 'Reduces stress, improves sleep, boosts energy, supports adrenal health',
    origin: 'India',
    classical_reference: 'Charaka Samhita - Ashwagandha as "Rasayana" (rejuvenator)',
    effectiveness: 'high',
    contraindications: 'May interact with sedatives. Avoid during pregnancy.',
    preparation_time: '15 minutes',
    dosage: '1 cup daily, preferably in evening',
    ethical_considerations: 'Sustainable wildcrafting, organic certification, fair trade',
    cost_effectiveness: 'medium',
    accessibility: 'high'
  }
];

// 4. PRODUCT RECOMMENDATIONS (Ethical and scalable)
const productRecommendations = {
  tulsi: [
    {
      name: 'Organic India Tulsi Tea',
      type: 'tea_bags',
      price: '$12.99',
      quantity: '25 bags',
      rating: 4.5,
      ethical_score: 9.2,
      sustainability: 'high',
      certifications: ['USDA Organic', 'Fair Trade'],
      availability: 'global',
      supplier: 'Organic India'
    },
    {
      name: 'Traditional Medicinals Tulsi Tea',
      type: 'tea_bags',
      price: '$8.99',
      quantity: '16 bags',
      rating: 4.3,
      ethical_score: 8.8,
      sustainability: 'high',
      certifications: ['USDA Organic', 'Non-GMO'],
      availability: 'global',
      supplier: 'Traditional Medicinals'
    }
  ],
  turmeric: [
    {
      name: 'Frontier Co-op Organic Turmeric',
      type: 'powder',
      price: '$9.99',
      quantity: '8 oz',
      rating: 4.6,
      ethical_score: 9.0,
      sustainability: 'high',
      certifications: ['USDA Organic', 'Fair Trade'],
      availability: 'global',
      supplier: 'Frontier Co-op'
    },
    {
      name: 'Simply Organic Turmeric',
      type: 'powder',
      price: '$7.99',
      quantity: '4.5 oz',
      rating: 4.4,
      ethical_score: 8.5,
      sustainability: 'medium',
      certifications: ['USDA Organic'],
      availability: 'global',
      supplier: 'Simply Organic'
    }
  ],
  ashwagandha: [
    {
      name: 'Organic India Ashwagandha',
      type: 'powder',
      price: '$19.99',
      quantity: '8 oz',
      rating: 4.7,
      ethical_score: 9.3,
      sustainability: 'high',
      certifications: ['USDA Organic', 'Fair Trade'],
      availability: 'global',
      supplier: 'Organic India'
    },
    {
      name: 'Himalaya Ashwagandha',
      type: 'capsules',
      price: '$24.99',
      quantity: '60 capsules',
      rating: 4.5,
      ethical_score: 8.9,
      sustainability: 'high',
      certifications: ['USDA Organic'],
      availability: 'global',
      supplier: 'Himalaya'
    }
  ]
};

// ===== API ROUTES =====

// Get all symptoms with enhanced data
app.get('/api/symptoms', (req, res) => {
  const { category } = req.query;
  
  if (category && symptomsData[category]) {
    res.json({
      success: true,
      data: symptomsData[category],
      total: symptomsData[category].length
    });
  } else {
    // Return all symptoms
    const allSymptoms = Object.values(symptomsData).flat();
    res.json({
      success: true,
      data: allSymptoms,
      total: allSymptoms.length,
      categories: Object.keys(symptomsData)
    });
  }
});

// Get causes for specific symptoms
app.get('/api/causes/:symptom', (req, res) => {
  const { symptom } = req.params;
  const causes = causesData[symptom] || [];
  
  res.json({
    success: true,
    data: causes,
    symptom: symptom,
    total: causes.length
  });
});

// Get remedies by symptoms with cause analysis
app.get('/api/remedies/by-symptoms', (req, res) => {
  const { symptoms } = req.query;
  
  if (!symptoms) {
    return res.status(400).json({
      success: false,
      message: 'Symptoms parameter is required'
    });
  }
  
  const symptomArray = symptoms.split(',');
  const remedies = remediesData.filter(remedy => 
    remedy.symptoms.some(symptom => symptomArray.includes(symptom))
  );
  
  // Add cause analysis for each remedy
  const enhancedRemedies = remedies.map(remedy => ({
    ...remedy,
    matched_symptoms: symptomArray.filter(s => remedy.symptoms.includes(s)),
    cause_analysis: remedy.causes,
    product_recommendations: getProductRecommendations(remedy.ingredients)
  }));
  
  res.json({
    success: true,
    data: enhancedRemedies,
    total: enhancedRemedies.length,
    matchedSymptoms: symptomArray,
    model: 'Symptom → Cause → Remedy → Product'
  });
});

// Get product recommendations
app.get('/api/products/:ingredient', (req, res) => {
  const { ingredient } = req.params;
  const products = productRecommendations[ingredient] || [];
  
  res.json({
    success: true,
    data: products,
    ingredient: ingredient,
    total: products.length
  });
});

// Get comprehensive analysis
app.get('/api/analysis/:symptom', (req, res) => {
  const { symptom } = req.params;
  
  const analysis = {
    symptom: symptom,
    causes: causesData[symptom] || [],
    remedies: remediesData.filter(remedy => 
      remedy.symptoms.includes(symptom)
    ),
    products: getProductRecommendationsForSymptom(symptom),
    ethical_considerations: {
      sustainability: 'All products sourced sustainably',
      fair_trade: 'Supporting fair trade practices',
      organic: 'Organic certification preferred',
      accessibility: 'Multiple price points available'
    }
  };
  
  res.json({
    success: true,
    data: analysis,
    model: 'Symptom → Cause → Remedy → Product'
  });
});

// Helper functions
function getProductRecommendations(ingredients) {
  const recommendations = [];
  ingredients.forEach(ingredient => {
    const ingredientName = ingredient.name.toLowerCase().split(' ')[0];
    if (productRecommendations[ingredientName]) {
      recommendations.push({
        ingredient: ingredient.name,
        products: productRecommendations[ingredientName]
      });
    }
  });
  return recommendations;
}

function getProductRecommendationsForSymptom(symptom) {
  const remedies = remediesData.filter(remedy => 
    remedy.symptoms.includes(symptom)
  );
  
  const allProducts = [];
  remedies.forEach(remedy => {
    const products = getProductRecommendations(remedy.ingredients);
    allProducts.push(...products);
  });
  
  return allProducts;
}

// Get all remedies
app.get('/api/remedies', (req, res) => {
  res.json({
    success: true,
    data: remediesData,
    total: remediesData.length,
    model: 'Symptom → Cause → Remedy → Product'
  });
});

// Get specific remedy
app.get('/api/remedies/:id', (req, res) => {
  const remedy = remediesData.find(r => r.id === req.params.id);
  
  if (!remedy) {
    return res.status(404).json({
      success: false,
      message: 'Remedy not found'
    });
  }
  
  const enhancedRemedy = {
    ...remedy,
    product_recommendations: getProductRecommendations(remedy.ingredients)
  };
  
  res.json({
    success: true,
    data: enhancedRemedy
  });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main page
app.get('/', (req, res) => {
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
  console.log(`🚀 Enhanced Ayurveda Remedy API running on port ${PORT}`);
  console.log(`📖 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔓 No API key required for development`);
  console.log(`🌱 Model: Symptom → Cause → Remedy → Product`);
  console.log(`⚖️ Ethical & Scalable Design Implemented`);
}); 
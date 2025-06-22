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
  console.log('styles-new.css route handler called');
  const filePath = path.join(__dirname, 'public', 'styles-new.css');
  console.log('Looking for file at:', filePath);
  console.log('File exists:', fs.existsSync(filePath));
  
  if (fs.existsSync(filePath)) {
    console.log('Serving styles-new.css with text/css MIME type');
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'styles-new.css not found' });
  }
});

app.get('/script-new.js', (req, res) => {
  console.log('script-new.js route handler called');
  const filePath = path.join(__dirname, 'public', 'script-new.js');
  
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'script-new.js not found' });
  }
});

app.get('/jspdf.min.js', (req, res) => {
  console.log('jspdf.min.js route handler called');
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

// Doshas data
const doshaInfo = {
  vata: {
    name: 'Vata',
    elements: ['Air', 'Ether'],
    qualities: ['Light', 'Cold', 'Dry', 'Rough', 'Subtle', 'Mobile'],
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

// Symptoms data
const symptomsData = {
  respiratory: [
    { id: 'cough', name: 'Cough' },
    { id: 'cold', name: 'Cold' },
    { id: 'fever', name: 'Fever' },
    { id: 'sore_throat', name: 'Sore Throat' },
    { id: 'congestion', name: 'Congestion' },
    { id: 'shortness_of_breath', name: 'Shortness of Breath' }
  ],
  digestive: [
    { id: 'indigestion', name: 'Indigestion' },
    { id: 'bloating', name: 'Bloating' },
    { id: 'constipation', name: 'Constipation' },
    { id: 'diarrhea', name: 'Diarrhea' },
    { id: 'nausea', name: 'Nausea' },
    { id: 'loss_of_appetite', name: 'Loss of Appetite' }
  ],
  mental: [
    { id: 'anxiety', name: 'Anxiety' },
    { id: 'stress', name: 'Stress' },
    { id: 'insomnia', name: 'Insomnia' },
    { id: 'depression', name: 'Depression' },
    { id: 'mood_swings', name: 'Mood Swings' },
    { id: 'brain_fog', name: 'Brain Fog' }
  ],
  pain: [
    { id: 'headache', name: 'Headache' },
    { id: 'back_pain', name: 'Back Pain' },
    { id: 'joint_pain', name: 'Joint Pain' },
    { id: 'muscle_pain', name: 'Muscle Pain' },
    { id: 'chronic_pain', name: 'Chronic Pain' }
  ],
  skin: [
    { id: 'acne', name: 'Acne' },
    { id: 'eczema', name: 'Eczema' },
    { id: 'dry_skin', name: 'Dry Skin' },
    { id: 'itching', name: 'Itching' },
    { id: 'rashes', name: 'Rashes' }
  ],
  energy: [
    { id: 'fatigue', name: 'Fatigue' },
    { id: 'low_energy', name: 'Low Energy' },
    { id: 'weakness', name: 'Weakness' },
    { id: 'tiredness', name: 'Tiredness' }
  ]
};

// Remedies data
const remediesData = [
  {
    id: '1',
    name: 'Tulsi Tea',
    category: 'respiratory',
    symptoms: ['cough', 'cold', 'fever', 'sore_throat'],
    ingredients: ['Tulsi leaves', 'Ginger', 'Honey', 'Black pepper'],
    instructions: 'Boil tulsi leaves with ginger, add honey and black pepper. Drink 2-3 times daily.',
    benefits: 'Boosts immunity, relieves cough and cold symptoms',
    origin: 'India'
  },
  {
    id: '2',
    name: 'Ginger Turmeric Milk',
    category: 'respiratory',
    symptoms: ['cough', 'cold', 'fever'],
    ingredients: ['Ginger', 'Turmeric', 'Milk', 'Honey'],
    instructions: 'Boil milk with ginger and turmeric, add honey. Drink before bed.',
    benefits: 'Anti-inflammatory, boosts immunity, relieves respiratory symptoms',
    origin: 'India'
  },
  {
    id: '3',
    name: 'Chamomile Tea',
    category: 'mental',
    symptoms: ['anxiety', 'stress', 'insomnia'],
    ingredients: ['Chamomile flowers', 'Honey'],
    instructions: 'Steep chamomile flowers in hot water, add honey. Drink before sleep.',
    benefits: 'Calming, promotes sleep, reduces anxiety',
    origin: 'Europe'
  },
  {
    id: '4',
    name: 'Peppermint Tea',
    category: 'digestive',
    symptoms: ['indigestion', 'bloating', 'nausea'],
    ingredients: ['Peppermint leaves', 'Honey'],
    instructions: 'Steep peppermint leaves in hot water, add honey. Drink after meals.',
    benefits: 'Soothes digestion, relieves bloating and nausea',
    origin: 'Europe'
  },
  {
    id: '5',
    name: 'Lemon Honey Water',
    category: 'respiratory',
    symptoms: ['cough', 'sore_throat', 'congestion'],
    ingredients: ['Lemon', 'Honey', 'Warm water'],
    instructions: 'Mix lemon juice and honey in warm water. Drink 2-3 times daily.',
    benefits: 'Soothes throat, boosts immunity, relieves congestion',
    origin: 'Global'
  }
];

// Routes
app.get('/api/doshas/info', (req, res) => {
  res.json({
    success: true,
    data: doshaInfo
  });
});

app.get('/api/symptoms', (req, res) => {
  const { category } = req.query;
  
  if (category && symptomsData[category]) {
    res.json({
      success: true,
      data: symptomsData[category]
    });
  } else {
    // Return all symptoms
    const allSymptoms = Object.values(symptomsData).flat();
    res.json({
      success: true,
      data: allSymptoms
    });
  }
});

app.get('/api/remedies', (req, res) => {
  res.json({
    success: true,
    data: remediesData
  });
});

// IMPORTANT: This route must come BEFORE /api/remedies/:id
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
  
  res.json({
    success: true,
    data: remedies,
    total: remedies.length,
    matchedSymptoms: symptomArray
  });
});

app.get('/api/remedies/:id', (req, res) => {
  const remedy = remediesData.find(r => r.id === req.params.id);
  
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
  console.log(`🚀 Ayurveda Remedy API running on port ${PORT}`);
  console.log(`📖 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔓 No API key required for development`);
}); 
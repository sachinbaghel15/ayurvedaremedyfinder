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
    { id: 'shortness_of_breath', name: 'Shortness of Breath' },
    { id: 'sinusitis', name: 'Sinusitis' },
    { id: 'bronchitis', name: 'Bronchitis' },
    { id: 'asthma', name: 'Asthma' },
    { id: 'hoarseness', name: 'Hoarseness' }
  ],
  digestive: [
    { id: 'indigestion', name: 'Indigestion' },
    { id: 'bloating', name: 'Bloating' },
    { id: 'constipation', name: 'Constipation' },
    { id: 'diarrhea', name: 'Diarrhea' },
    { id: 'nausea', name: 'Nausea' },
    { id: 'loss_of_appetite', name: 'Loss of Appetite' },
    { id: 'acid_reflux', name: 'Acid Reflux' },
    { id: 'heartburn', name: 'Heartburn' },
    { id: 'gas', name: 'Gas' },
    { id: 'abdominal_pain', name: 'Abdominal Pain' }
  ],
  mental: [
    { id: 'anxiety', name: 'Anxiety' },
    { id: 'stress', name: 'Stress' },
    { id: 'insomnia', name: 'Insomnia' },
    { id: 'depression', name: 'Depression' },
    { id: 'mood_swings', name: 'Mood Swings' },
    { id: 'brain_fog', name: 'Brain Fog' },
    { id: 'memory_problems', name: 'Memory Problems' },
    { id: 'concentration_issues', name: 'Concentration Issues' },
    { id: 'panic_attacks', name: 'Panic Attacks' },
    { id: 'sleep_problems', name: 'Sleep Problems' }
  ],
  pain: [
    { id: 'headache', name: 'Headache' },
    { id: 'back_pain', name: 'Back Pain' },
    { id: 'joint_pain', name: 'Joint Pain' },
    { id: 'muscle_pain', name: 'Muscle Pain' },
    { id: 'chronic_pain', name: 'Chronic Pain' },
    { id: 'inflammation', name: 'Inflammation' },
    { id: 'arthritis', name: 'Arthritis' },
    { id: 'migraine', name: 'Migraine' },
    { id: 'neck_pain', name: 'Neck Pain' },
    { id: 'sciatica', name: 'Sciatica' }
  ],
  skin: [
    { id: 'acne', name: 'Acne' },
    { id: 'eczema', name: 'Eczema' },
    { id: 'dry_skin', name: 'Dry Skin' },
    { id: 'itching', name: 'Itching' },
    { id: 'rashes', name: 'Rashes' },
    { id: 'psoriasis', name: 'Psoriasis' },
    { id: 'hives', name: 'Hives' },
    { id: 'fungal_infection', name: 'Fungal Infection' },
    { id: 'dermatitis', name: 'Dermatitis' },
    { id: 'oily_skin', name: 'Oily Skin' }
  ],
  energy: [
    { id: 'fatigue', name: 'Fatigue' },
    { id: 'low_energy', name: 'Low Energy' },
    { id: 'weakness', name: 'Weakness' },
    { id: 'tiredness', name: 'Tiredness' },
    { id: 'adrenal_fatigue', name: 'Adrenal Fatigue' },
    { id: 'lethargy', name: 'Lethargy' }
  ],
  womens_health: [
    { id: 'irregular_periods', name: 'Irregular Periods' },
    { id: 'pms', name: 'PMS' },
    { id: 'menstrual_cramps', name: 'Menstrual Cramps' },
    { id: 'hot_flashes', name: 'Hot Flashes' },
    { id: 'menopause', name: 'Menopause' },
    { id: 'pcos', name: 'PCOS' },
    { id: 'infertility', name: 'Infertility' },
    { id: 'low_libido', name: 'Low Libido' }
  ],
  mens_health: [
    { id: 'low_libido', name: 'Low Libido' },
    { id: 'erectile_dysfunction', name: 'Erectile Dysfunction' },
    { id: 'prostate_problems', name: 'Prostate Problems' },
    { id: 'andropause', name: 'Andropause' },
    { id: 'hair_loss', name: 'Hair Loss' }
  ],
  general: [
    { id: 'frequent_infections', name: 'Frequent Infections' },
    { id: 'allergies', name: 'Allergies' },
    { id: 'autoimmune_disease', name: 'Autoimmune Disease' },
    { id: 'diabetes', name: 'Diabetes' },
    { id: 'high_blood_pressure', name: 'High Blood Pressure' },
    { id: 'thyroid_problems', name: 'Thyroid Problems' },
    { id: 'weight_gain', name: 'Weight Gain' },
    { id: 'weight_loss', name: 'Weight Loss' },
    { id: 'aging_concerns', name: 'Aging Concerns' },
    { id: 'vitamin_c_deficiency', name: 'Vitamin C Deficiency' }
  ]
};

// ===== ENHANCED MODEL: Symptom → Cause → Remedy → Product =====

// 2. CAUSES DATA (Root cause analysis)
const causesData = {
  // Respiratory causes
  cough: ['viral_infection', 'bacterial_infection', 'allergies', 'smoking', 'pollution', 'dry_air'],
  cold: ['viral_infection', 'weakened_immunity', 'seasonal_changes', 'stress'],
  fever: ['infection', 'inflammation', 'immune_response', 'viral_bacterial'],
  sore_throat: ['viral_infection', 'bacterial_infection', 'acid_reflux', 'dry_air', 'smoking'],
  congestion: ['allergies', 'sinus_infection', 'viral_infection', 'environmental_factors'],
  
  // Digestive causes
  indigestion: ['poor_diet', 'stress', 'overeating', 'food_intolerance', 'low_digestive_fire'],
  bloating: ['poor_diet', 'food_intolerance', 'stress', 'imbalanced_doshas', 'weak_digestion'],
  constipation: ['poor_diet', 'dehydration', 'lack_of_fiber', 'stress', 'vata_imbalance'],
  diarrhea: ['food_poisoning', 'viral_infection', 'stress', 'pitta_imbalance', 'poor_diet'],
  nausea: ['digestive_upset', 'stress', 'motion_sickness', 'pregnancy', 'medication'],
  
  // Mental causes
  anxiety: ['stress', 'vata_imbalance', 'poor_sleep', 'caffeine', 'genetic_factors'],
  stress: ['work_pressure', 'relationship_issues', 'financial_worries', 'health_concerns'],
  insomnia: ['stress', 'vata_imbalance', 'poor_sleep_hygiene', 'caffeine', 'screen_time'],
  depression: ['chemical_imbalance', 'stress', 'genetic_factors', 'life_events', 'kapha_imbalance'],
  mood_swings: ['hormonal_imbalance', 'stress', 'pitta_imbalance', 'poor_diet'],
  
  // Pain causes
  headache: ['stress', 'dehydration', 'poor_posture', 'eye_strain', 'vata_imbalance'],
  back_pain: ['poor_posture', 'muscle_strain', 'stress', 'vata_imbalance', 'aging'],
  joint_pain: ['inflammation', 'arthritis', 'overuse', 'kapha_imbalance', 'aging'],
  muscle_pain: ['overuse', 'stress', 'poor_posture', 'dehydration', 'vata_imbalance'],
  chronic_pain: ['inflammation', 'nerve_damage', 'stress', 'dosha_imbalance', 'aging'],
  
  // Skin causes
  acne: ['hormonal_imbalance', 'poor_diet', 'stress', 'pitta_imbalance', 'bacteria'],
  eczema: ['allergies', 'stress', 'dry_skin', 'immune_system_issues', 'vata_imbalance'],
  dry_skin: ['dehydration', 'weather', 'aging', 'vata_imbalance', 'poor_skincare'],
  itching: ['allergies', 'dry_skin', 'stress', 'vata_imbalance', 'skin_conditions'],
  rashes: ['allergies', 'contact_dermatitis', 'stress', 'pitta_imbalance', 'infections'],
  
  // Energy causes
  fatigue: ['poor_sleep', 'stress', 'poor_diet', 'dehydration', 'dosha_imbalance'],
  low_energy: ['poor_diet', 'stress', 'lack_of_exercise', 'dosha_imbalance', 'sleep_issues'],
  weakness: ['poor_diet', 'dehydration', 'stress', 'illness', 'vata_imbalance'],
  tiredness: ['poor_sleep', 'stress', 'overwork', 'dosha_imbalance', 'poor_diet'],
  adrenal_fatigue: ['chronic_stress', 'poor_diet', 'lack_of_sleep', 'overwork', 'dosha_imbalance']
};

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

// Enhanced Remedies data with nutritional info, body benefits, and product suggestions
const remediesData = [
  {
    id: '1',
    name: 'Tulsi (Holy Basil) Tea',
    category: 'respiratory',
    symptoms: ['cough', 'cold', 'fever', 'sore_throat', 'congestion'],
    ingredients: [
      {
        name: 'Tulsi leaves',
        nutritional_info: 'Rich in eugenol, ursolic acid, rosmarinic acid',
        body_benefits: 'Anti-inflammatory, antimicrobial, adaptogenic properties. Boosts immunity, reduces stress hormones, supports respiratory health',
        product_suggestion: 'Organic Tulsi Tea Bags - Organic India or Traditional Medicinals'
      },
      {
        name: 'Ginger',
        nutritional_info: 'Contains gingerol, shogaol, zingerone',
        body_benefits: 'Anti-inflammatory, anti-nausea, warming properties. Improves circulation, reduces inflammation, supports digestion',
        product_suggestion: 'Fresh ginger root or Ginger Tea - Yogi Tea or Traditional Medicinals'
      },
      {
        name: 'Honey',
        nutritional_info: 'Natural sugars, antioxidants, enzymes',
        body_benefits: 'Antimicrobial, soothing, energy-boosting. Coats throat, provides quick energy, supports gut health',
        product_suggestion: 'Raw Manuka Honey - Wedderspoon or Local Raw Honey'
      },
      {
        name: 'Black pepper',
        nutritional_info: 'Piperine, essential oils, minerals',
        body_benefits: 'Enhances bioavailability, warming, digestive. Improves nutrient absorption, stimulates digestion',
        product_suggestion: 'Organic Black Pepper - Frontier Co-op or Simply Organic'
      }
    ],
    instructions: 'Boil 1 cup water, add 5-6 fresh tulsi leaves and 1/2 inch ginger (sliced). Simmer 5 minutes, strain, add 1 tsp honey and a pinch of black pepper. Drink 2-3 times daily.',
    benefits: 'Boosts immunity, relieves respiratory symptoms, reduces stress, supports overall wellness',
    origin: 'India',
    classical_reference: 'Charaka Samhita - Tulsi is mentioned as "Elixir of Life"',
    effectiveness: 'high',
    contraindications: 'May interact with blood thinners. Avoid during pregnancy in large amounts.',
    preparation_time: '10 minutes',
    dosage: '2-3 cups daily'
  },
  {
    id: '2',
    name: 'Golden Milk (Turmeric Latte)',
    category: 'respiratory',
    symptoms: ['cough', 'cold', 'fever', 'inflammation', 'chronic_pain'],
    ingredients: [
      {
        name: 'Turmeric',
        nutritional_info: 'Curcumin, turmerone, essential oils',
        body_benefits: 'Powerful anti-inflammatory, antioxidant, immune-boosting. Reduces inflammation, supports liver health, improves brain function',
        product_suggestion: 'Organic Turmeric Powder - Frontier Co-op or Simply Organic'
      },
      {
        name: 'Milk (or plant milk)',
        nutritional_info: 'Calcium, protein, vitamin D, probiotics',
        body_benefits: 'Calming, nourishing, sleep-promoting. Provides calcium, supports bone health, promotes relaxation',
        product_suggestion: 'Organic Whole Milk or Almond Milk - Califia Farms or Oatly'
      },
      {
        name: 'Black pepper',
        nutritional_info: 'Piperine, essential oils',
        body_benefits: 'Enhances curcumin absorption by 2000%, warming, digestive',
        product_suggestion: 'Organic Black Pepper - Frontier Co-op'
      },
      {
        name: 'Honey',
        nutritional_info: 'Natural sugars, antioxidants',
        body_benefits: 'Sweetening, antimicrobial, soothing',
        product_suggestion: 'Raw Honey - Local or Manuka Honey'
      }
    ],
    instructions: 'Heat 1 cup milk, add 1/2 tsp turmeric, 1/4 tsp black pepper, 1 tsp honey. Simmer 5 minutes, strain and drink before bed.',
    benefits: 'Anti-inflammatory, immune-boosting, sleep-promoting, pain-relieving',
    origin: 'India',
    classical_reference: 'Sushruta Samhita - Turmeric as "Haridra" for healing',
    effectiveness: 'high',
    contraindications: 'May interact with blood thinners. Avoid if allergic to dairy.',
    preparation_time: '10 minutes',
    dosage: '1 cup before bed'
  },
  {
    id: '3',
    name: 'Ashwagandha Chai',
    category: 'mental',
    symptoms: ['anxiety', 'stress', 'insomnia', 'fatigue', 'low_energy'],
    ingredients: [
      {
        name: 'Ashwagandha',
        nutritional_info: 'Withanolides, alkaloids, saponins',
        body_benefits: 'Adaptogenic, stress-reducing, energy-boosting. Reduces cortisol, improves sleep, enhances stamina',
        product_suggestion: 'Organic Ashwagandha Powder - Organic India or Himalaya'
      },
      {
        name: 'Cardamom',
        nutritional_info: 'Essential oils, cineole, terpinene',
        body_benefits: 'Digestive, warming, aromatic. Improves digestion, reduces bloating, soothes nerves',
        product_suggestion: 'Organic Cardamom Pods - Frontier Co-op'
      },
      {
        name: 'Cinnamon',
        nutritional_info: 'Cinnamaldehyde, antioxidants, minerals',
        body_benefits: 'Blood sugar balancing, warming, anti-inflammatory',
        product_suggestion: 'Organic Cinnamon Powder - Simply Organic'
      },
      {
        name: 'Milk',
        nutritional_info: 'Calcium, protein, tryptophan',
        body_benefits: 'Calming, sleep-promoting, nourishing',
        product_suggestion: 'Organic Whole Milk or Almond Milk'
      }
    ],
    instructions: 'Boil 1 cup water with 1/4 tsp ashwagandha, 2 cardamom pods, 1/4 tsp cinnamon. Add 1/2 cup milk, simmer 5 minutes, strain and drink.',
    benefits: 'Reduces stress, improves sleep, boosts energy, supports adrenal health',
    origin: 'India',
    classical_reference: 'Charaka Samhita - Ashwagandha as "Rasayana" (rejuvenator)',
    effectiveness: 'high',
    contraindications: 'May interact with sedatives. Avoid during pregnancy.',
    preparation_time: '15 minutes',
    dosage: '1 cup daily, preferably in evening'
  },
  {
    id: '4',
    name: 'Triphala Digestive Tea',
    category: 'digestive',
    symptoms: ['indigestion', 'bloating', 'constipation', 'loss_of_appetite'],
    ingredients: [
      {
        name: 'Triphala',
        nutritional_info: 'Tannins, polyphenols, vitamin C',
        body_benefits: 'Gentle laxative, digestive tonic, detoxifying. Balances all three doshas, improves digestion',
        product_suggestion: 'Organic Triphala Powder - Organic India or Banyan Botanicals'
      },
      {
        name: 'Ginger',
        nutritional_info: 'Gingerol, shogaol, essential oils',
        body_benefits: 'Digestive stimulant, anti-inflammatory, warming',
        product_suggestion: 'Fresh ginger root or Ginger Powder'
      },
      {
        name: 'Fennel seeds',
        nutritional_info: 'Anethole, essential oils, fiber',
        body_benefits: 'Carminative, digestive, anti-bloating',
        product_suggestion: 'Organic Fennel Seeds - Frontier Co-op'
      }
    ],
    instructions: 'Boil 1 cup water, add 1/2 tsp triphala, 1/4 tsp ginger, 1/4 tsp fennel seeds. Simmer 10 minutes, strain and drink after meals.',
    benefits: 'Improves digestion, relieves bloating, gentle detoxification, balances doshas',
    origin: 'India',
    classical_reference: 'Charaka Samhita - Triphala as "Tridoshic" (balances all doshas)',
    effectiveness: 'high',
    contraindications: 'May cause mild diarrhea initially. Start with small doses.',
    preparation_time: '15 minutes',
    dosage: '1 cup after meals'
  },
  {
    id: '5',
    name: 'Neem Skin Care Tea',
    category: 'skin',
    symptoms: ['acne', 'eczema', 'rashes', 'itching', 'inflammation'],
    ingredients: [
      {
        name: 'Neem leaves',
        nutritional_info: 'Azadirachtin, nimbin, quercetin',
        body_benefits: 'Antimicrobial, anti-inflammatory, blood-purifying. Clears skin, supports liver detox',
        product_suggestion: 'Organic Neem Powder - Organic India or Banyan Botanicals'
      },
      {
        name: 'Turmeric',
        nutritional_info: 'Curcumin, antioxidants',
        body_benefits: 'Anti-inflammatory, skin-healing, antioxidant',
        product_suggestion: 'Organic Turmeric Powder'
      },
      {
        name: 'Honey',
        nutritional_info: 'Antimicrobial compounds, enzymes',
        body_benefits: 'Antimicrobial, skin-soothing, healing',
        product_suggestion: 'Raw Honey or Manuka Honey'
      }
    ],
    instructions: 'Boil 1 cup water, add 1/4 tsp neem powder, 1/4 tsp turmeric. Simmer 10 minutes, strain, add honey. Drink 1-2 times daily.',
    benefits: 'Clears skin, reduces inflammation, supports liver health, blood purification',
    origin: 'India',
    classical_reference: 'Sushruta Samhita - Neem as "Sarva Roga Nivarini" (curer of all diseases)',
    effectiveness: 'high',
    contraindications: 'Bitter taste. May cause mild stomach upset. Avoid during pregnancy.',
    preparation_time: '15 minutes',
    dosage: '1-2 cups daily'
  },
  {
    id: '6',
    name: 'Brahmi Memory Tea',
    category: 'mental',
    symptoms: ['brain_fog', 'memory_problems', 'concentration_issues', 'stress'],
    ingredients: [
      {
        name: 'Brahmi (Bacopa)',
        nutritional_info: 'Bacosides, alkaloids, saponins',
        body_benefits: 'Cognitive enhancer, memory-boosting, neuroprotective. Improves learning, reduces anxiety',
        product_suggestion: 'Organic Brahmi Powder - Organic India or Himalaya'
      },
      {
        name: 'Jatamansi',
        nutritional_info: 'Essential oils, sesquiterpenes',
        body_benefits: 'Calming, sleep-promoting, nervine tonic',
        product_suggestion: 'Organic Jatamansi Powder - Banyan Botanicals'
      },
      {
        name: 'Honey',
        nutritional_info: 'Natural sugars, antioxidants',
        body_benefits: 'Brain fuel, calming, sweetening',
        product_suggestion: 'Raw Honey'
      }
    ],
    instructions: 'Boil 1 cup water, add 1/4 tsp brahmi, 1/8 tsp jatamansi. Simmer 10 minutes, strain, add honey. Drink in morning.',
    benefits: 'Improves memory, enhances concentration, reduces stress, supports brain health',
    origin: 'India',
    classical_reference: 'Charaka Samhita - Brahmi as "Medhya Rasayana" (brain tonic)',
    effectiveness: 'high',
    contraindications: 'May interact with thyroid medications. Start with small doses.',
    preparation_time: '15 minutes',
    dosage: '1 cup in morning'
  },
  {
    id: '7',
    name: 'Guggulu Joint Care Tea',
    category: 'pain',
    symptoms: ['joint_pain', 'arthritis', 'back_pain', 'inflammation'],
    ingredients: [
      {
        name: 'Guggulu',
        nutritional_info: 'Guggulsterones, essential oils, resins',
        body_benefits: 'Anti-inflammatory, joint-protecting, detoxifying. Reduces inflammation, supports joint health',
        product_suggestion: 'Organic Guggulu Powder - Banyan Botanicals or Organic India'
      },
      {
        name: 'Ginger',
        nutritional_info: 'Gingerol, anti-inflammatory compounds',
        body_benefits: 'Anti-inflammatory, pain-relieving, warming',
        product_suggestion: 'Fresh ginger root'
      },
      {
        name: 'Turmeric',
        nutritional_info: 'Curcumin, anti-inflammatory compounds',
        body_benefits: 'Anti-inflammatory, pain-relieving, antioxidant',
        product_suggestion: 'Organic Turmeric Powder'
      }
    ],
    instructions: 'Boil 1 cup water, add 1/4 tsp guggulu, 1/4 tsp ginger, 1/4 tsp turmeric. Simmer 15 minutes, strain and drink.',
    benefits: 'Reduces joint pain, decreases inflammation, supports mobility, detoxification',
    origin: 'India',
    classical_reference: 'Charaka Samhita - Guggulu as "Yogavahi" (carrier of other herbs)',
    effectiveness: 'high',
    contraindications: 'May interact with blood thinners. Avoid during pregnancy.',
    preparation_time: '20 minutes',
    dosage: '1 cup daily'
  },
  {
    id: '8',
    name: 'Shatavari Women\'s Health Tea',
    category: 'general',
    symptoms: ['fatigue', 'low_energy', 'hot_flashes', 'irregular_periods'],
    ingredients: [
      {
        name: 'Shatavari',
        nutritional_info: 'Saponins, alkaloids, sterols',
        body_benefits: 'Hormone-balancing, nourishing, rejuvenating. Supports female reproductive health',
        product_suggestion: 'Organic Shatavari Powder - Organic India or Banyan Botanicals'
      },
      {
        name: 'Cardamom',
        nutritional_info: 'Essential oils, digestive compounds',
        body_benefits: 'Digestive, warming, aromatic',
        product_suggestion: 'Organic Cardamom Pods'
      },
      {
        name: 'Honey',
        nutritional_info: 'Natural sugars, minerals',
        body_benefits: 'Nourishing, sweetening, calming',
        product_suggestion: 'Raw Honey'
      }
    ],
    instructions: 'Boil 1 cup water, add 1/2 tsp shatavari, 2 cardamom pods. Simmer 10 minutes, strain, add honey. Drink daily.',
    benefits: 'Hormone balance, energy-boosting, reproductive health, stress reduction',
    origin: 'India',
    classical_reference: 'Charaka Samhita - Shatavari as "Rasayana" for women',
    effectiveness: 'high',
    contraindications: 'May affect hormone levels. Consult doctor if on hormone therapy.',
    preparation_time: '15 minutes',
    dosage: '1 cup daily'
  },
  {
    id: '9',
    name: 'Yashtimadhu (Licorice) Throat Soother',
    category: 'respiratory',
    symptoms: ['sore_throat', 'cough', 'hoarseness', 'acid_reflux'],
    ingredients: [
      {
        name: 'Yashtimadhu (Licorice)',
        nutritional_info: 'Glycyrrhizin, flavonoids, saponins',
        body_benefits: 'Demulcent, anti-inflammatory, soothing. Coats throat, reduces inflammation, supports adrenal health',
        product_suggestion: 'Organic Licorice Root - Banyan Botanicals or Organic India'
      },
      {
        name: 'Honey',
        nutritional_info: 'Natural sugars, antimicrobial compounds',
        body_benefits: 'Antimicrobial, soothing, healing. Coats throat, provides energy',
        product_suggestion: 'Raw Manuka Honey - Wedderspoon'
      },
      {
        name: 'Ginger',
        nutritional_info: 'Gingerol, anti-inflammatory compounds',
        body_benefits: 'Anti-inflammatory, warming, digestive',
        product_suggestion: 'Fresh ginger root'
      }
    ],
    instructions: 'Boil 1 cup water, add 1/4 tsp licorice powder, 1/4 tsp ginger. Simmer 10 minutes, strain, add honey. Drink 2-3 times daily.',
    benefits: 'Soothes throat, reduces inflammation, supports digestive health, adrenal support',
    origin: 'India',
    classical_reference: 'Charaka Samhita - Yashtimadhu as "Madhura" (sweet) herb',
    effectiveness: 'high',
    contraindications: 'May raise blood pressure. Avoid if hypertensive. Limit to 2 weeks.',
    preparation_time: '15 minutes',
    dosage: '2-3 cups daily'
  },
  {
    id: '10',
    name: 'Amla (Indian Gooseberry) Immunity Booster',
    category: 'general',
    symptoms: ['frequent_infections', 'low_energy', 'aging_concerns', 'vitamin_c_deficiency'],
    ingredients: [
      {
        name: 'Amla (Indian Gooseberry)',
        nutritional_info: 'Vitamin C (20x more than orange), tannins, polyphenols',
        body_benefits: 'Immunity-boosting, antioxidant, rejuvenating. Highest natural vitamin C, anti-aging, supports collagen',
        product_suggestion: 'Organic Amla Powder - Organic India or Banyan Botanicals'
      },
      {
        name: 'Honey',
        nutritional_info: 'Natural sugars, enzymes, antioxidants',
        body_benefits: 'Energy-boosting, antimicrobial, soothing',
        product_suggestion: 'Raw Honey'
      },
      {
        name: 'Black pepper',
        nutritional_info: 'Piperine, essential oils',
        body_benefits: 'Enhances absorption, warming, digestive',
        product_suggestion: 'Organic Black Pepper'
      }
    ],
    instructions: 'Mix 1/2 tsp amla powder with 1 tsp honey and a pinch of black pepper. Take on empty stomach in morning.',
    benefits: 'Boosts immunity, anti-aging, vitamin C supplement, collagen support',
    origin: 'India',
    classical_reference: 'Charaka Samhita - Amla as "Rasayana" (rejuvenator)',
    effectiveness: 'high',
    contraindications: 'May cause acidity in some. Take with food if sensitive.',
    preparation_time: '5 minutes',
    dosage: '1 dose daily in morning'
  },
  {
    id: '11',
    name: 'Jatamansi Sleep Tea',
    category: 'mental',
    symptoms: ['insomnia', 'anxiety', 'stress', 'sleep_problems'],
    ingredients: [
      {
        name: 'Jatamansi (Spikenard)',
        nutritional_info: 'Essential oils, sesquiterpenes, valeranone',
        body_benefits: 'Calming, sleep-promoting, nervine tonic. Reduces anxiety, promotes deep sleep',
        product_suggestion: 'Organic Jatamansi Powder - Banyan Botanicals'
      },
      {
        name: 'Chamomile',
        nutritional_info: 'Apigenin, bisabolol, chamazulene',
        body_benefits: 'Calming, anti-inflammatory, sleep-promoting',
        product_suggestion: 'Organic Chamomile Flowers - Traditional Medicinals'
      },
      {
        name: 'Honey',
        nutritional_info: 'Natural sugars, tryptophan',
        body_benefits: 'Sleep-promoting, calming, energy source',
        product_suggestion: 'Raw Honey'
      }
    ],
    instructions: 'Boil 1 cup water, add 1/4 tsp jatamansi, 1/2 tsp chamomile. Simmer 10 minutes, strain, add honey. Drink 30 minutes before bed.',
    benefits: 'Promotes deep sleep, reduces anxiety, calms nervous system, stress relief',
    origin: 'India',
    classical_reference: 'Sushruta Samhita - Jatamansi as "Nidrajanana" (sleep-inducing)',
    effectiveness: 'high',
    contraindications: 'May cause drowsiness. Avoid driving after consumption.',
    preparation_time: '15 minutes',
    dosage: '1 cup 30 minutes before bed'
  },
  {
    id: '12',
    name: 'Haritaki Digestive Cleanse',
    category: 'digestive',
    symptoms: ['constipation', 'bloating', 'indigestion', 'detoxification'],
    ingredients: [
      {
        name: 'Haritaki (Terminalia chebula)',
        nutritional_info: 'Tannins, chebulic acid, polyphenols',
        body_benefits: 'Gentle laxative, digestive tonic, detoxifying. Balances vata dosha, improves digestion',
        product_suggestion: 'Organic Haritaki Powder - Banyan Botanicals'
      },
      {
        name: 'Ginger',
        nutritional_info: 'Gingerol, digestive enzymes',
        body_benefits: 'Digestive stimulant, anti-inflammatory, warming',
        product_suggestion: 'Fresh ginger root'
      },
      {
        name: 'Honey',
        nutritional_info: 'Natural sugars, enzymes',
        body_benefits: 'Digestive support, energy, soothing',
        product_suggestion: 'Raw Honey'
      }
    ],
    instructions: 'Mix 1/4 tsp haritaki powder with 1 tsp honey and 1/4 tsp ginger. Take with warm water before bed.',
    benefits: 'Gentle detoxification, improves digestion, relieves constipation, balances vata',
    origin: 'India',
    classical_reference: 'Charaka Samhita - Haritaki as "Abhaya" (fearless)',
    effectiveness: 'high',
    contraindications: 'May cause mild diarrhea initially. Start with small doses.',
    preparation_time: '5 minutes',
    dosage: '1 dose before bed'
  }
];

// Helper functions for enhanced model
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

// ===== ENHANCED MODEL API ENDPOINTS =====

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

// Enhanced remedies by symptoms with cause analysis
app.get('/api/remedies/enhanced/by-symptoms', (req, res) => {
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
    cause_analysis: remedy.causes || [],
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
  console.log(`🚀 Enhanced Ayurveda Remedy API running on port ${PORT}`);
  console.log(`📖 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔓 No API key required for development`);
  console.log(`🌱 Model: Symptom → Cause → Remedy → Product`);
  console.log(`⚖️ Ethical & Scalable Design Implemented`);
}); 
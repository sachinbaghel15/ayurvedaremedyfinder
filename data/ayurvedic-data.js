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
  },
  {
    id: '13',
    name: 'Cumin Coriander Fennel Tea',
    category: 'digestive',
    symptoms: ['indigestion', 'bloating', 'gas', 'heaviness'],
    ingredients: [
      {
        name: 'Cumin seeds',
        nutritional_info: 'Rich in iron, antioxidants, cuminaldehyde',
        body_benefits: 'Aids digestion, reduces bloating, antimicrobial',
        product_suggestion: 'Organic Cumin Seeds - Frontier Co-op'
      },
      {
        name: 'Coriander seeds',
        nutritional_info: 'Linalool, antioxidants, minerals',
        body_benefits: 'Soothes digestion, reduces acidity, detoxifying',
        product_suggestion: 'Organic Coriander Seeds - Simply Organic'
      },
      {
        name: 'Fennel seeds',
        nutritional_info: 'Anethole, fiber, essential oils',
        body_benefits: 'Relieves gas, carminative, cooling',
        product_suggestion: 'Organic Fennel Seeds - Frontier Co-op'
      }
    ],
    instructions: 'Boil 2 cups water, add 1 tsp each of cumin, coriander, and fennel seeds. Simmer 10 minutes, strain and drink warm after meals.',
    benefits: 'Improves digestion, relieves bloating and gas, detoxifies the system',
    origin: 'India',
    classical_reference: 'Traditional Ayurvedic home remedy for digestion',
    effectiveness: 'high',
    contraindications: 'None known in moderate amounts.',
    preparation_time: '15 minutes',
    dosage: '1 cup after meals'
  },
  {
    id: '14',
    name: 'Gotu Kola Calming Tea',
    category: 'mental',
    symptoms: ['anxiety', 'brain_fog', 'poor_concentration', 'restlessness'],
    ingredients: [
      {
        name: 'Gotu Kola',
        nutritional_info: 'Triterpenoids, asiaticoside, vitamins',
        body_benefits: 'Calms nerves, improves memory, reduces anxiety',
        product_suggestion: 'Organic Gotu Kola - Banyan Botanicals'
      },
      {
        name: 'Brahmi',
        nutritional_info: 'Bacosides, saponins',
        body_benefits: 'Cognitive enhancer, stress relief',
        product_suggestion: 'Organic Brahmi Powder - Organic India'
      },
      {
        name: 'Honey',
        nutritional_info: 'Natural sugars, antioxidants',
        body_benefits: 'Soothing, calming, sweetening',
        product_suggestion: 'Raw Honey'
      }
    ],
    instructions: 'Boil 1 cup water, add 1/2 tsp gotu kola and 1/4 tsp brahmi. Simmer 5 minutes, strain, add honey. Drink in the afternoon or evening.',
    benefits: 'Reduces anxiety, improves focus, calms the mind',
    origin: 'India',
    classical_reference: 'Gotu Kola and Brahmi are classic Ayurvedic medhya rasayanas (brain tonics)',
    effectiveness: 'high',
    contraindications: 'Avoid during pregnancy. May interact with sedatives.',
    preparation_time: '10 minutes',
    dosage: '1 cup daily'
  }
];

const doshasData = {
    vata: {
        name: 'Vata',
        description: 'Vata represents the energy of movement and is associated with the elements of air and ether. It governs bodily functions such as breathing, circulation, and nerve impulses.',
        characteristics: [
            'Creative and energetic',
            'Slim build',
            'Prone to anxiety and insomnia'
        ],
        balancing_remedies: [
            'Warm, nourishing foods',
            'Regular routine',
            'Calming herbs like Ashwagandha'
        ]
    },
    pitta: {
        name: 'Pitta',
        description: 'Pitta embodies the energy of transformation and is linked to the elements of fire and water. It controls digestion, metabolism, and body temperature.',
        characteristics: [
            'Intelligent and focused',
            'Medium build',
            'Prone to anger and inflammation'
        ],
        balancing_remedies: [
            'Cooling foods and drinks',
            'Stress management',
            'Soothing herbs like Brahmi'
        ]
    },
    kapha: {
        name: 'Kapha',
        description: 'Kapha signifies the energy of structure and lubrication, connected to the elements of earth and water. It governs immunity, strength, and stability.',
        characteristics: [
            'Calm and compassionate',
            'Strong build',
            'Prone to congestion and weight gain'
        ],
        balancing_remedies: [
            'Light, warm foods',
            'Regular exercise',
            'Stimulating herbs like Trikatu'
        ]
    }
};

const symptomsData = {
  "respiratory": [
    {
      "symptom": "cough",
      "name": "Cough",
      "description": "A reflex action to clear your airways of mucus and irritants such as dust or smoke."
    },
    {
      "symptom": "cold",
      "name": "Cold",
      "description": "A viral infection that affects the nose, throat, and sometimes the lungs."
    },
    {
      "symptom": "fever",
      "name": "Fever",
      "description": "An elevated body temperature as a symptom of an infection or illness."
    },
    {
      "symptom": "sore_throat",
      "name": "Sore Throat",
      "description": "Inflammation and irritation of the throat."
    },
    {
      "symptom": "congestion",
      "name": "Congestion",
      "description": "A blockage in the airways, often due to an infection or allergies."
    }
  ],
  "digestive": [
    {
      "symptom": "indigestion",
      "name": "Indigestion",
      "description": "Discomfort or pain in the stomach associated with difficulty in digesting food."
    },
    {
      "symptom": "bloating",
      "name": "Bloating",
      "description": "A feeling of fullness or swelling in the abdomen."
    },
    {
      "symptom": "gas",
      "name": "Gas",
      "description": "Excess air or gas in the digestive tract causing discomfort or flatulence."
    },
    {
      "symptom": "heaviness",
      "name": "Heaviness",
      "description": "A sensation of weight or sluggishness in the stomach after eating."
    }
  ],
  "mental": [
    {
      "symptom": "anxiety",
      "name": "Anxiety",
      "description": "A feeling of worry, nervousness, or unease."
    },
    {
      "symptom": "brain_fog",
      "name": "Brain Fog",
      "description": "A state of mental confusion or lack of clarity."
    },
    {
      "symptom": "poor_concentration",
      "name": "Poor Concentration",
      "description": "Difficulty focusing or maintaining attention."
    },
    {
      "symptom": "restlessness",
      "name": "Restlessness",
      "description": "An inability to relax or remain still."
    }
  ]
};

module.exports = {
    causesData,
    productRecommendations,
    remediesData,
    doshasData,
    symptomsData
}; 
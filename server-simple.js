const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 4000;

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

// Comprehensive worldwide symptoms data
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

// Comprehensive worldwide remedies data
const worldwideRemediesData = [
    {
        id: 'ginger_tea',
        name: 'Ginger Tea',
        category: 'digestive',
        origin: 'India',
        effectiveness: 'high',
        description: 'Traditional Ayurvedic remedy for digestive issues',
        ingredients: ['Fresh ginger', 'Water', 'Honey', 'Lemon'],
        preparation: 'Boil fresh ginger in water, add honey and lemon',
        dosage: '1-2 cups daily',
        symptoms: ['indigestion', 'nausea', 'bloating', 'gas'],
        benefits: ['Improves digestion', 'Reduces nausea', 'Relieves bloating'],
        contraindications: ['Pregnancy (consult doctor)', 'Bleeding disorders'],
        suitableFor: ['vata', 'kapha'],
        price: 5.99
    },
    {
        id: 'turmeric_milk',
        name: 'Golden Milk (Turmeric)',
        category: 'general',
        origin: 'India',
        effectiveness: 'high',
        description: 'Anti-inflammatory golden milk with turmeric',
        ingredients: ['Turmeric powder', 'Milk', 'Honey', 'Black pepper', 'Ginger'],
        preparation: 'Heat milk with turmeric, add honey and spices',
        dosage: '1 cup before bed',
        symptoms: ['inflammation', 'joint_pain', 'chronic_pain', 'general_inflammation'],
        benefits: ['Reduces inflammation', 'Boosts immunity', 'Improves sleep'],
        contraindications: ['Gallbladder issues', 'Blood thinners'],
        suitableFor: ['vata', 'pitta', 'kapha'],
        price: 8.99
    },
    {
        id: 'ashwagandha_tea',
        name: 'Ashwagandha Tea',
        category: 'nervous',
        origin: 'India',
        effectiveness: 'high',
        description: 'Adaptogenic herb for stress and anxiety',
        ingredients: ['Ashwagandha powder', 'Water', 'Honey', 'Milk'],
        preparation: 'Boil ashwagandha in water, strain and add honey',
        dosage: '1-2 cups daily',
        symptoms: ['anxiety', 'stress', 'insomnia', 'fatigue'],
        benefits: ['Reduces stress', 'Improves sleep', 'Boosts energy'],
        contraindications: ['Pregnancy', 'Autoimmune conditions'],
        suitableFor: ['vata', 'kapha'],
        price: 12.99
    },
    {
        id: 'triphala_churna',
        name: 'Triphala Powder',
        category: 'digestive',
        origin: 'India',
        effectiveness: 'high',
        description: 'Traditional three-fruit blend for digestive health',
        ingredients: ['Amla', 'Haritaki', 'Bibhitaki'],
        preparation: 'Mix with warm water or honey',
        dosage: '1/2 teaspoon daily',
        symptoms: ['constipation', 'indigestion', 'bloating', 'gas'],
        benefits: ['Improves digestion', 'Detoxifies body', 'Boosts immunity'],
        contraindications: ['Pregnancy', 'Diarrhea'],
        suitableFor: ['vata', 'pitta', 'kapha'],
        price: 15.99
    },
    {
        id: 'neem_tea',
        name: 'Neem Tea',
        category: 'skin',
        origin: 'India',
        effectiveness: 'moderate',
        description: 'Natural antibacterial and antifungal remedy',
        ingredients: ['Neem leaves', 'Water', 'Honey'],
        preparation: 'Boil neem leaves in water, strain and add honey',
        dosage: '1 cup daily',
        symptoms: ['acne', 'skin_inflammation', 'fungal_infection', 'rashes'],
        benefits: ['Clears skin', 'Fights infections', 'Detoxifies blood'],
        contraindications: ['Pregnancy', 'Diabetes medications'],
        suitableFor: ['pitta'],
        price: 9.99
    },
    {
        id: 'brahmi_tea',
        name: 'Brahmi Tea',
        category: 'nervous',
        origin: 'India',
        effectiveness: 'moderate',
        description: 'Brain tonic for memory and concentration',
        ingredients: ['Brahmi powder', 'Water', 'Honey'],
        preparation: 'Boil brahmi in water, strain and add honey',
        dosage: '1 cup daily',
        symptoms: ['memory_problems', 'concentration_issues', 'anxiety', 'stress'],
        benefits: ['Improves memory', 'Enhances concentration', 'Reduces anxiety'],
        contraindications: ['Pregnancy', 'Low blood pressure'],
        suitableFor: ['vata', 'kapha'],
        price: 11.99
    },
    {
        id: 'amla_juice',
        name: 'Amla Juice',
        category: 'immune',
        origin: 'India',
        effectiveness: 'high',
        description: 'Vitamin C rich immune booster',
        ingredients: ['Amla fruit', 'Water', 'Honey'],
        preparation: 'Extract juice from fresh amla, dilute with water',
        dosage: '2 tablespoons daily',
        symptoms: ['frequent_infections', 'low_energy', 'fatigue', 'aging_concerns'],
        benefits: ['Boosts immunity', 'Improves energy', 'Anti-aging'],
        contraindications: ['Acidity', 'Ulcers'],
        suitableFor: ['vata', 'pitta', 'kapha'],
        price: 14.99
    },
    {
        id: 'shatavari_tea',
        name: 'Shatavari Tea',
        category: 'reproductive',
        origin: 'India',
        effectiveness: 'moderate',
        description: 'Women\'s health tonic and hormone balancer',
        ingredients: ['Shatavari powder', 'Water', 'Milk', 'Honey'],
        preparation: 'Boil shatavari in water, add milk and honey',
        dosage: '1 cup daily',
        symptoms: ['pms', 'menstrual_cramps', 'menopause', 'infertility'],
        benefits: ['Balances hormones', 'Supports fertility', 'Reduces PMS'],
        contraindications: ['Pregnancy', 'Breastfeeding'],
        suitableFor: ['vata', 'pitta'],
        price: 13.99
    },
    {
        id: 'guggulu_powder',
        name: 'Guggulu Powder',
        category: 'joints',
        origin: 'India',
        effectiveness: 'moderate',
        description: 'Traditional remedy for joint and bone health',
        ingredients: ['Guggulu resin', 'Triphala', 'Ginger'],
        preparation: 'Mix with warm water or honey',
        dosage: '1/2 teaspoon daily',
        symptoms: ['joint_pain', 'arthritis', 'back_pain', 'inflammation'],
        benefits: ['Reduces joint pain', 'Improves mobility', 'Anti-inflammatory'],
        contraindications: ['Pregnancy', 'Bleeding disorders'],
        suitableFor: ['vata', 'kapha'],
        price: 16.99
    },
    {
        id: 'arjuna_bark_tea',
        name: 'Arjuna Bark Tea',
        category: 'cardiovascular',
        origin: 'India',
        effectiveness: 'moderate',
        description: 'Heart tonic and cardiovascular support',
        ingredients: ['Arjuna bark', 'Water', 'Honey'],
        preparation: 'Boil arjuna bark in water, strain and add honey',
        dosage: '1 cup daily',
        symptoms: ['chest_pain', 'palpitations', 'high_blood_pressure', 'poor_circulation'],
        benefits: ['Supports heart health', 'Lowers blood pressure', 'Improves circulation'],
        contraindications: ['Low blood pressure', 'Heart medications'],
        suitableFor: ['pitta', 'kapha'],
        price: 18.99
    }
];

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
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdnjs.cloudflare.com"],
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

// Specific route handlers for static files (BEFORE static middleware to ensure correct MIME types)
app.get('/script-new.js', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(__dirname, 'public', 'script-new.js');
  
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(filePath);
  } else {
    res.status(404).json({
      error: 'File not found',
      path: filePath,
      currentDir: __dirname
    });
  }
});

app.get('/jspdf.min.js', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(__dirname, 'public', 'jspdf.min.js');
  
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(filePath);
  } else {
    res.status(404).json({
      error: 'File not found',
      path: filePath,
      currentDir: __dirname
    });
  }
});

app.get('/styles.css', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(__dirname, 'public', 'styles.css');
  
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(filePath);
  } else {
    res.status(404).json({
      error: 'File not found',
      path: filePath,
      currentDir: __dirname
    });
  }
});

app.get('/styles-new.css', (req, res) => {
  console.log('styles-new.css route handler called');
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(__dirname, 'public', 'styles-new.css');
  
  console.log('Looking for file at:', filePath);
  console.log('File exists:', fs.existsSync(filePath));
  
  if (fs.existsSync(filePath)) {
    console.log('Serving styles-new.css with text/css MIME type');
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(filePath);
  } else {
    console.log('File not found, sending 404');
    res.status(404).json({
      error: 'File not found',
      path: filePath,
      currentDir: __dirname
    });
  }
});

// Serve static files from public directory with proper MIME types
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
    }
  },
  filter: (req, res) => {
    // Skip files that have dedicated route handlers
    const skipFiles = ['/script-new.js', '/jspdf.min.js', '/styles.css', '/styles-new.css'];
    return !skipFiles.includes(req.path);
  }
}));

// Fallback for Render deployment - try alternative paths
app.use(express.static(path.join(__dirname, 'src', 'public'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
    }
  }
}));

// Additional fallback paths for Render
app.use(express.static(path.join(__dirname, '..', 'public'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
    }
  }
}));

app.use(express.static(path.join(__dirname, '..', 'src', 'public'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
    }
  }
}));

// API Key authentication middleware
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-rapidapi-key'] || req.headers['x-api-key'] || req.query.api_key;
  
  // Allow frontend access with a simple key or no key for basic functionality
  if (!apiKey || apiKey === 'frontend-key' || apiKey === 'demo-key') {
    // For frontend requests, allow access but mark as frontend
    req.isFrontend = true;
    req.apiKey = apiKey || 'frontend-key';
    return next();
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
  req.isFrontend = false;
  next();
};

// Apply authentication to specific API routes only (not usage endpoints or frontend)
app.use('/api/doshas/info', authenticateApiKey);
app.use('/api/doshas/assessment', authenticateApiKey);
app.use('/api/remedies/by-symptoms', authenticateApiKey);
app.use('/api/remedies/by-dosha', authenticateApiKey);
app.use('/api/remedies/search', authenticateApiKey);
app.use('/api/remedies/:id', authenticateApiKey);

// Health check endpoint (no authentication required)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Ayurveda Remedy API is running',
    timestamp: new Date().toISOString()
  });
});

// API health check endpoint (no authentication required)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Ayurveda Remedy API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
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

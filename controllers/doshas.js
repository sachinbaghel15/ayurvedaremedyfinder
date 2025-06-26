// Dosha information data
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
    },
    imbalances: [
      'Anxiety and nervousness',
      'Insomnia',
      'Constipation',
      'Dry skin',
      'Joint pain',
      'Irregular digestion'
    ],
    balancing: {
      lifestyle: [
        'Regular routine and schedule',
        'Warm, cooked foods',
        'Gentle exercise like yoga',
        'Adequate rest and sleep',
        'Warm oil massage (abhyanga)'
      ],
      foods: [
        'Sweet, sour, and salty tastes',
        'Warm, cooked, and moist foods',
        'Dairy products',
        'Nuts and seeds',
        'Root vegetables'
      ],
      avoid: [
        'Cold, dry, and raw foods',
        'Bitter, astringent, and pungent tastes',
        'Irregular eating habits',
        'Excessive travel and movement'
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
    },
    imbalances: [
      'Acidity and heartburn',
      'Skin rashes and inflammation',
      'Excessive heat and sweating',
      'Irritability and anger',
      'Ulcers and bleeding disorders'
    ],
    balancing: {
      lifestyle: [
        'Cool and calming activities',
        'Moderate exercise',
        'Avoid excessive sun exposure',
        'Regular meal times',
        'Cooling meditation practices'
      ],
      foods: [
        'Sweet, bitter, and astringent tastes',
        'Cooling foods and drinks',
        'Fresh fruits and vegetables',
        'Dairy products',
        'Grains like rice and wheat'
      ],
      avoid: [
        'Hot, spicy, and sour foods',
        'Excessive salt and oil',
        'Alcohol and caffeine',
        'Hot weather and activities'
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
    },
    imbalances: [
      'Weight gain and obesity',
      'Congestion and mucus',
      'Lethargy and depression',
      'Slow digestion',
      'Diabetes and water retention'
    ],
    balancing: {
      lifestyle: [
        'Regular exercise and movement',
        'Early rising and sleeping',
        'Stimulating activities',
        'Dry massage with powders',
        'Warm and dry environment'
      ],
      foods: [
        'Pungent, bitter, and astringent tastes',
        'Light, dry, and warm foods',
        'Honey and spices',
        'Legumes and vegetables',
        'Fruits like apples and pears'
      ],
      avoid: [
        'Sweet, sour, and salty tastes',
        'Heavy, oily, and cold foods',
        'Dairy products',
        'Excessive sleep and rest',
        'Cold and damp environments'
      ]
    }
  }
};

// @desc    Get dosha information
// @route   GET /api/doshas/info
// @access  Public
const getDoshaInfo = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: doshaInfo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dosha assessment questions
// @route   GET /api/doshas/assessment
// @access  Public
const getDoshaAssessment = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

// @desc    Submit dosha assessment
// @route   POST /api/doshas/assessment
// @access  Public
const submitDoshaAssessment = async (req, res, next) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide answers array'
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
      description: doshaInfo[dominantDosha],
      recommendations: {
        lifestyle: doshaInfo[dominantDosha].balancing.lifestyle,
        foods: doshaInfo[dominantDosha].balancing.foods,
        avoid: doshaInfo[dominantDosha].balancing.avoid
      }
    };

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dosha-specific recommendations
// @route   GET /api/doshas/recommendations/:doshaType
// @access  Public
const getDoshaRecommendations = async (req, res, next) => {
  try {
    const { doshaType } = req.params;

    // Get remedies suitable for this dosha
    const remedies = await Remedy.find({
      $or: [
        { suitableFor: doshaType },
        { suitableFor: 'all' }
      ],
      isApproved: true
    }).populate('createdBy', 'name').limit(10);

    // Get herbs that balance this dosha
    const herbs = await Herb.find({
      [`doshaEffects.${doshaType}`]: 'balances',
      isApproved: true
    }).populate('createdBy', 'name').limit(10);

    const recommendations = {
      doshaType,
      doshaInfo: doshaInfo[doshaType] || null,
      remedies,
      herbs,
      lifestyle: doshaInfo[doshaType]?.balancing.lifestyle || [],
      foods: doshaInfo[doshaType]?.balancing.foods || [],
      avoid: doshaInfo[doshaType]?.balancing.avoid || []
    };

    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoshaInfo,
  getDoshaAssessment,
  submitDoshaAssessment,
  getDoshaRecommendations
}; 
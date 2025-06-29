const { remediesData, productRecommendations, causesData } = require('../data/ayurvedic-data');

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

function enrichRemedy(remedy) {
  return {
    ...remedy,
    matched_condition: remedy.matched_condition || 'General imbalance',
    herbs: remedy.herbs || (remedy.ingredients ? remedy.ingredients.map(ing => ({
      name: ing.name || '',
      reason: ing.body_benefits || '',
      dosage: '',
      form: '',
      timing: ''
    })) : []),
    lifestyle_tips: remedy.lifestyle_tips || [],
    food_suggestions: remedy.food_suggestions || [],
    urgent: typeof remedy.urgent === 'boolean' ? remedy.urgent : false
  };
}

const getRemedies = (req, res) => {
  res.json({
    success: true,
    data: remediesData.map(enrichRemedy)
  });
};

const getRemedyById = (req, res) => {
  let remedy = remediesData.find(r => r.id === req.params.id);
  
  if (!remedy) {
    return res.status(404).json({
      success: false,
      message: 'Remedy not found'
    });
  }

  res.json({
    success: true,
    data: enrichRemedy(remedy)
  });
};

const getRemediesBySymptom = (req, res) => {
  const { symptoms } = req.query;
  
  if (!symptoms) {
    return res.status(400).json({
      success: false,
      message: 'Symptoms parameter is required'
    });
  }
  
  const symptomArray = symptoms.split(',');
  let remedies = remediesData.filter(remedy => 
    remedy.symptoms.some(symptom => symptomArray.includes(symptom))
  ).map(enrichRemedy);
  
  res.json({
    success: true,
    data: remedies,
    total: remedies.length,
    matchedSymptoms: symptomArray
  });
};

const getEnhancedRemediesBySymptom = (req, res) => {
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
  ).map(enrichRemedy);
  
  // Add cause analysis for each remedy
  const enhancedRemedies = remedies.map(remedy => ({
    ...remedy,
    matched_symptoms: symptomArray.filter(s => remedy.symptoms.includes(s)),
    cause_analysis: causesData[remedy.symptoms.find(s => symptomArray.includes(s))] || [],
    product_recommendations: getProductRecommendations(remedy.ingredients)
  }));
  
  res.json({
    success: true,
    data: enhancedRemedies,
    total: enhancedRemedies.length,
    matchedSymptoms: symptomArray
  });
};

// Search remedies by symptoms (for /search endpoint)
const searchRemedies = (req, res) => {
  const { symptoms } = req.query;
  if (!symptoms) {
    return res.status(400).json({
      success: false,
      message: 'Symptoms parameter is required'
    });
  }
  const symptomArray = symptoms.split(',');
  let remedies = remediesData.filter(remedy => 
    remedy.symptoms.some(symptom => symptomArray.includes(symptom))
  ).map(enrichRemedy);
  res.json({
    success: true,
    data: remedies,
    total: remedies.length,
    matchedSymptoms: symptomArray
  });
};

module.exports = {
  getRemedies,
  getRemedyById,
  getRemediesBySymptom,
  getEnhancedRemediesBySymptom,
  searchRemedies
}; 
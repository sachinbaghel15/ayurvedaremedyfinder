const { symptomsData } = require('../data/ayurvedic-data');

// @desc    Get symptoms
// @route   GET /api/symptoms
// @access  Public
const getSymptoms = (req, res) => {
  const { category } = req.query;
  
  let symptoms;
  if (category && symptomsData[category]) {
    symptoms = symptomsData[category];
  } else {
    // Return all symptoms
    symptoms = Object.values(symptomsData).flat();
  }
  
  res.json({
    success: true,
    data: symptoms
  });
};

module.exports = {
  getSymptoms
};
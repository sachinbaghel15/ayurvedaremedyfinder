const express = require('express');
const { getSymptoms } = require('../controllers/symptomsController');

const router = express.Router();

router.route('/').get(getSymptoms);

module.exports = router; 
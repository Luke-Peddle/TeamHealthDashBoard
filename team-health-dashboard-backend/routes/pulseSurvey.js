const express = require('express');
const router = express.Router();
const pulseSurveyController = require('../controller/pulseSurveysController');

router.post('/', pulseSurveyController.createPulseRecord);

module.exports = router;
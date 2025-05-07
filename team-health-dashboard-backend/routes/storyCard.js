const express = require('express');
const router = express.Router();
const storyCardController = require('../controller/storyCardController');

router.post('/', storyCardController.createStoryCard);
router.get('/', storyCardController.getAllStoryCards);

module.exports = router;
const express = require('express');
const router = express.Router();
const storyCardController = require('../controller/storyCardController');

router.post('/', storyCardController.createStoryCard);
router.get('/', storyCardController.getAllStoryCards);
router.get('/:id', storyCardController.getStoryCardBySprintId);
router.patch('/:id', storyCardController.updateStoryCarde);
router.delete('/:id', storyCardController.DeleteStoryCard);



module.exports = router;
const express = require('express');
const router = express.Router();
const sprintContoller = require('../controller/sprintController');

router.post('/', sprintContoller.createSprint);
router.get('/', sprintContoller.getAllSprints);
router.get('/:id', sprintContoller.getSprintByProjectId);

module.exports = router;
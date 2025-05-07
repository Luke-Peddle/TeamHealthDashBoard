const express = require('express');
const router = express.Router();
const sprintContoller = require('../controller/sprintController');

router.post('/', sprintContoller.createSprint);
router.get('/', sprintContoller.getAllSprints);

module.exports = router;
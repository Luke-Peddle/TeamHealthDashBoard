const express = require('express');
const router = express.Router();
const volocityController = require('../controller/velocityController');

router.post('/', volocityController.createVolocityRecord);
router.get('/:id', volocityController.getVelocityByProjectId);

module.exports = router;
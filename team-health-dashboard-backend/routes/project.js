const express = require('express');
const router = express.Router();
const projectController = require('../controller/projectController');

router.post('/', projectController.createProject);
router.get('/', projectController.getAllProjects);

module.exports = router;
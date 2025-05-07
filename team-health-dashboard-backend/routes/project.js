const express = require('express');
const router = express.Router();
const projectController = require('../controller/projectController');

router.post('/', projectController.createProject);
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectByManagerId);
router.delete('/:id', projectController.DeleteProject);



module.exports = router;
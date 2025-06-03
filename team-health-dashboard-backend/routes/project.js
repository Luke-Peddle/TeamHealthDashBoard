const express = require('express');
const router = express.Router();
const projectController = require('../controller/projectController');

router.post('/', projectController.createProject);
router.post('/addMember/:project_id/:user_id', projectController.addMemberToProject);
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.get('/manager/:id', projectController.getProjectByManagerId);
router.patch('/:id', projectController.updateProject);
router.delete('/:id/:manager_id', projectController.DeleteProject);



module.exports = router;
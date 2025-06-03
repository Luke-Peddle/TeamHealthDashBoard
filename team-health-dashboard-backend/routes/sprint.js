const express = require('express');
const router = express.Router();
const sprintContoller = require('../controller/sprintController');

router.post('/', sprintContoller.createSprint);
router.get('/', sprintContoller.getAllSprints);
router.patch('/:id', sprintContoller.updateSprint);
router.get('/:id', sprintContoller.getSprintById);
router.get('/project/:id', sprintContoller.getSprintByProjectId);
router.delete('/:id/:project_id', sprintContoller.DeleteSprint);


module.exports = router;
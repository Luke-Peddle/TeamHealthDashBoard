const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');


router.post('/', userController.createUser);
router.get('/teamMembers/:project_id', userController.getTeamMembers);
router.get('/nonTeamMembers/:project_id', userController.getNonTeamMembers);
router.get('/', userController.getAllUsers);
router.get('/contributors', userController.getContributors);
router.get('/:id', userController.getUsers);
router.patch('/', userController.updateUser);
router.patch('/darkMode', userController.updateUserDarkMode);
router.delete('/id/:id', userController.DeleteUsers);
router.delete('/removeMember/:project_id/:user_id', userController.removeMember);



module.exports = router;
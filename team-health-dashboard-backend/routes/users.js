const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');


router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/id/:id', userController.getUsers);
router.patch('/', userController.updateUser);
router.delete('/id/:id', userController.DeleteUsers);


module.exports = router;
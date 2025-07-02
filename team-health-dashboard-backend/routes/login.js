const express = require('express');
const router = express.Router();
const loginController = require('../controller/loginController');



router.post('/', loginController.login);
router.post('/refresh', loginController.refresh);
router.post('/logout', loginController.logout);


module.exports = router;
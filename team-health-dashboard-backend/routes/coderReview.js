const express = require('express');
const router = express.Router();
const CodeReviewController = require('../controller/CodeReviewController');

router.post('/', CodeReviewController.createCodeReviewlRecord);

module.exports = router;
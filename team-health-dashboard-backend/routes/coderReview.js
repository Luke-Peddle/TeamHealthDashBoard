const express = require('express');
const router = express.Router();
const CodeReviewController = require('../controller/CodeReviewController');

router.post('/', CodeReviewController.createCodeReviewlRecord);
router.get('/:id', CodeReviewController.getCodeReviewByProjectId);

module.exports = router;
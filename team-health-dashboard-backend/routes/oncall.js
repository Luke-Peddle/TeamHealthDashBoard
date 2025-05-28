const express = require('express');
const router = express.Router();
const onCallController = require('../controller/oncallController');

router.post('/', onCallController.createOncallRecord);
router.get('/:id', onCallController.getOnCallByProjectId);

module.exports = router;
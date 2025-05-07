const express = require('express');
const router = express.Router();
const clearCache = require("../controller/clearCache");

router.get('/clearCache', clearCache.clearCache);

module.exports = router;
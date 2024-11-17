
const express = require('express');
const router = express.Router();
const { generateDocument } = require('../controllers');

// router.post('/request-document', sendVerificationCode);
router.post('/generate-document/:type', generateDocument);

module.exports = router;

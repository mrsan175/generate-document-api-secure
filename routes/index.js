
const express = require('express');
const router = express.Router();
const {
  generateDocument,
  allDocuments,
  getDocument,
  createDocuments,
  updateDocument,
  removeDocument,
  validateOtp
} = require('../controllers');

// router.post('/request-document', sendVerificationCode);

router.get('/validate-otp/:otp', validateOtp);

// generate document
router.post('/generate-document/:type/:otp', generateDocument);

// document routes
router.get('/documents', allDocuments);
router.get('/document/:id', getDocument);
router.put('/document/:id', updateDocument);
router.post('/document', createDocuments);
router.delete('/document/:id', removeDocument);

module.exports = router;

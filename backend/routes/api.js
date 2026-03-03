const express = require('express');
const authenticateToken = require('../middleware/auth');
const apiController = require('../controllers/apiController');

const router = express.Router();
router.use(authenticateToken);

// Get User's Uploads
router.get('/uploads', apiController.getUserUploads);

// Get QA Pairs for an upload
router.get('/uploads/:id/pairs', apiController.getUploadPairs);

// Update a QA Pair
router.put('/pairs/:id', apiController.updatePair);

// Export CSV
router.get('/exports/:id/csv', apiController.exportCsv);

// Export HTML
router.get('/exports/:id/html', apiController.exportHtml);

module.exports = router;

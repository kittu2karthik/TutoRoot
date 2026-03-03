const express = require('express');
const multer = require('multer');
const authenticateToken = require('../middleware/auth');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post(
  '/',
  authenticateToken,
  upload.fields([{ name: 'questionPdf' }, { name: 'answerPdf' }]),
  uploadController.uploadPdfs
);

module.exports = router;

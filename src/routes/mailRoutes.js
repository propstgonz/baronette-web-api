const express = require('express');
const router = express.Router();
const mailController = require('../controllers/mailController');

router.post('/register-mail', mailController.registerMail);

module.exports = router;

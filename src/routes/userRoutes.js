const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /login - Ruta para gestionar el login de usuarios
router.post('/login', userController.loginUser);

module.exports = router;

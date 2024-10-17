const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /login - Ruta para gestionar el login de usuarios
router.post('/login', userController.loginUser);

// POST /settings - Ruta para acceder a los ajustes de usuario
router.post('/settings', userController.checkAdmin);

// POST /register - Ruta para el registro de un nuevo usuario
router.post('/register', userController.registerUser);

module.exports = router;

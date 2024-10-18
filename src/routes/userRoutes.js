const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /login - Ruta para gestionar el login de usuarios
router.post('/login', userController.loginUser);

// POST /register - Ruta para el registro de un nuevo usuario
router.post('/register', userController.registerUser);

// POST /settings - Ruta para acceder a los ajustes de usuario
router.post('/settings', userController.checkAdmin);

// POST /delete-user - Ruta para eliminar un usuario seleccionado
router.delete('/delete-user/:username', userController.deleteSelectedUser);

// GET /unverified-users Ruta para recoger usuarios no verificados
router.get('/unverified-users', userController.getUnverifiedUsers);

// POST /verify-users - Ruta para verificar usuarios seleccionados
router.post('/verify-users', userController.verifyUsers);

// GET /verified-users Ruta para recoger los usuarios verificados
router.get('/verified-users', userController.getUnverifiedUsers);

// POST /delete-account - Ruta para eliminar la propia cuenta de usuario
router.delete('/delete-account', userController.deleteAccount);

// PATCH /update-user - Ruta para actualizar la información de un usuario
router.patch('/update-user/:user_id', userController.updateUserInfo);

// PATCH /change-password/:user_id - Ruta para cambiar la contraseña del usuario
router.patch('/change-password/:user_id', userController.changePassword);


module.exports = router;

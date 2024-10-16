const userModel = require('../models/userModel');

/**
 * Manejador del login del usuario
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userModel.findUserByUsername(username);

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Comprobación usuario verificado
    if (!user.verified) {
      return res.status(401).json(
        { message: 'Usuario sin verificar. Un administrador te validará pronto.' }
      );
    }

    // Comparador de la contraseña (aquí podemos hashearla)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    return res.status(200).json({ message: '¡Acceso correcto!' });
  } catch (error) {
    console.error('Error durante el acceso:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  loginUser,
};

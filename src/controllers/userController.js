const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const pool = require('../config/database');


/**
 * Manejador del login del usuario
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  console.log(`Login request received: ${username}`);

  try {
    const user = await userModel.findUserByUsername(username);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Comparador de la contraseña (hasheada en el register)
    const isPasswordValid = await bcrypt.compare(password, user.user_password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Comprobación usuario verificado
    if (!user.verified) {
      return res.status(403).json(
        { 
          message:
          'Usuario sin verificar. Un administrador te validará pronto.' 
        }
      );
    }
    console.log(`User ${username} logged in successfully.`);
    return res.status(200).json(
      {
         message: '¡Acceso correcto!',
         user_id: user.id 
      }
    );
  } catch (error) {
    console.error('Error durante el acceso:', error.message);
    return res.status(500).json({ message: 'Error durante el acceso' });
  }
};

/**
 * Manejador del admin check
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const checkAdmin = async (req, res) => {
  const { user_id } = req.body;

  try {
    // Comprueba que el user_id se encuentre en admin_list
    const isAdmin = await userModel.checkIfAdmin(user_id);

    if (isAdmin) {
      return res.status(200).json(
        { message: 'Entrando en ajustes como administrador' }
      );
    } else {
      return res.status(200).json(
        { message: 'Entrando en ajustes de usuario' }
      );
    }
  } catch (error) {
    console.error('Error checking admin status:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


/**
 * Registrar un nuevo usuario
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const registerUser = async (req, res) => {
  const { 
    first_name, last_name_1, last_name_2,
    username, user_password, email 
  } = req.body;

  try {
    // Validar que el nombre de usuario es único
    const existingUserByUsername = await userModel.findUserByUsername(username);
    if (existingUserByUsername) {
      return res.status(400).json(
        { message: 'El nombre de usuario ya existe.' }
      );
    }

    // Validar que el correo electrónico es único
    const existingUserByEmail = await userModel.findUserByEmail(email);
    if (existingUserByEmail) {
      return res.status(400).json(
        { message: 'El correo electrónico ya está registrado.' }
      );
    }

    // Si todas las validaciones son correctas, registrar el nuevo usuario
    await userModel.createUser({
      first_name,
      last_name_1,
      last_name_2: last_name_2 || null,
      username,
      user_password,
      email,
    });

    return res.status(201).json({ message: 'Usuario registrado con éxito.' });
  } catch (error) {
    console.error('Error registrando usuario:', error);
    return res.status(500).json(
      { message: 'Error en el servidor al registrar usuario.' }
    );
  }
};


/**
 * Obtiene los usuarios no verificados
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getUnverifiedUsers = async (req, res) => {
  try {
    const query = `
      SELECT first_name, last_name_1, last_name_2, username, email 
      FROM public.user_list 
      WHERE verified = FALSE
    `;
    const result = await pool.query(query);

    // Devuelve los usuarios en formato JSON
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving unverified users:', error.message);
    res.status(500).json({ message: 'Error retrieving unverified users' });
  }
};



module.exports = {
  loginUser,
  checkAdmin,
  registerUser,
  getUnverifiedUsers,
};

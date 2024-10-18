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


/**
 * Verificar usuarios seleccionados
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const verifyUsers = async (req, res) => {
  const { usernames } = req.body; // Se espera un array de usernames

  if (!Array.isArray(usernames) || usernames.length === 0) {
      return res.status(400).json({ message: 'No se han enviado usuarios para verificar.' });
  }

  try {
      await userModel.verifyUsers(usernames); // Llama al método en el modelo para actualizar la base de datos
      return res.status(200).json({ message: 'Usuarios verificados exitosamente.' });
  } catch (error) {
      console.error('Error al verificar usuarios:', error.message);
      return res.status(500).json({ message: 'Error al verificar usuarios.' });
  }
};


/**
 * Elimina la cuenta de un usuario.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const deleteAccount = async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
      return res.status(400).json({ message: 'user_id es requerido' });
  }

  try {
      const result = await userModel.deleteUserById(user_id);

      if (result.rowCount === 0) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      return res.status(200).json({ message: 'Cuenta eliminada con éxito' });
  } catch (error) {
      console.error('Error al eliminar la cuenta:', error.message);
      return res.status(500).json({ message: 'Error interno del servidor' });
  }
};


/**
 * Elimina un usuario a partir de su username.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const deleteSelectedUser = async (req, res) => {
  const { username } = req.params; // Esperamos un único username

  if (!username) {
      return res.status(400).json({ message: 'Se requiere un username' });
  }

  try {
      const result = await userModel.deleteUserByUsername(username);

      if (result.rowCount === 0) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      return res.status(200).json({ message: 'Usuario eliminado con éxito' });
  } catch (error) {
      console.error('Error al eliminar usuario:', error.message);
      return res.status(500).json({ message: 'Error interno del servidor' });
  }
};


/**
 * Actualiza la información de un usuario a partir de su user_id.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const updateUserInfo = async (req, res) => {
  const userId = req.params.user_id;
  if (!userId) {
    return res.status(400).json({ message: 'Se requiere un user_id' });
  }

  const { first_name, last_name1, last_name2, email } = req.body;
  const updatedInfo = {};

  if (first_name) updatedInfo.first_name = first_name;
  if (last_name1) updatedInfo.last_name1 = last_name1;
  if (last_name2) updatedInfo.last_name2 = last_name2;
  if (email) updatedInfo.email = email;

  if (Object.keys(updatedInfo).length === 0) {
    return res.status(400).json({ message: 'No se proporcionó información para actualizar.' });
  }

  try {
    const result = await userModel.updateUserById(userId, updatedInfo);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({ message: 'Información actualizada con éxito' });
  } catch (error) {
    console.error('Error al actualizar la información del usuario:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}


/**
 * Cambia la contraseña de un usuario a partir de su ID.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const changePassword = async (req, res) => {
  const userId = req.params.user_id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Se requieren ambas contraseñas.' });
  }

  try {
      const user = await userModel.getUserById(userId);

      if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      const isMatch = await userModel.verifyPassword(currentPassword, user.user_password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Contraseña actual incorrecta.' });
      }

      await userModel.updatePassword(userId, newPassword);

      return res.status(200).json({ message: 'Contraseña actualizada con éxito.' });
  } catch (error) {
      console.error('Error al cambiar la contraseña:', error.message);
      return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  loginUser,
  checkAdmin,
  registerUser,
  getUnverifiedUsers,
  verifyUsers,
  deleteAccount,
  deleteSelectedUser,
  updateUserInfo,
  changePassword,
};
const pool = require('../config/database');
const bcrypt = require('bcrypt');


/**
 * Buscar usuario por username en la base de datos
 * @param {string} username - El username a buscar
 * @returns {Promise<object>} - Devuelve un Promise con los datos de usuario.
 */
const findUserByUsername = async (username) => {
  const query = 'SELECT * FROM public.user_list WHERE username = $1';
  const result = await pool.query(query, [username]);
  return result.rows[0] || null;
};


/**
 * Verificar si un usuario existe por correo electrónico
 * @param {string} email
 * @returns {Promise<object|null>} - Devuelve el usuario o null si no existe
 */
const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM public.user_list WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
};


/**
 * Comprueba si el usuario es administrador
 * @param {string} user_id - el id del usuario
 * @returns {Promise<boolean>} - Devuelve true si es admin, false si no
 */
const checkIfAdmin = async (user_id) => {
  try {
    const query = 'SELECT * FROM public.admin_list WHERE user_id = $1';
    const result = await pool.query(query, [user_id]);
    return result.rows.length > 0; // True si el id está en admin_list
  } catch (error) {
    throw new Error('Database query error');
  }
};


/**
 * Crear un nuevo usuario
 * @param {object} userData - Los datos del usuario
 * @returns {Promise<void>}
 */
const createUser = async (userData) => {
  const { 
    first_name, last_name_1, last_name_2,
    username, user_password, email
  } = userData;

  try {
    // Hashear la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(user_password, 10);

    const query = `
      INSERT INTO public.user_list (
      first_name, last_name_1, last_name_2, username, user_password, email
      )
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = [
      first_name, last_name_1, last_name_2, username, hashedPassword, email
    ];
    
    await pool.query(query, values);

  } catch (error) {
    throw new Error('Error al crear el usuario: ' + error.message);
  }
};


module.exports = {
  findUserByUsername,
  findUserByEmail,
  checkIfAdmin,
  createUser,
};

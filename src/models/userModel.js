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



/**
 * Verificar usuarios en la base de datos
 * @param {Array<string>} usernames - Array de nombres de usuario a verificar
 * @returns {Promise<void>}
 */
const verifyUsers = async (usernames) => {
  try {
    const query = `
      UPDATE public.user_list SET verified = TRUE WHERE username = ANY($1)
    `;
    const values = [usernames]; // PostgreSQL permite pasar un array usando ANY

    await pool.query(query, values);
  } catch (error) {
    throw new Error('Error al verificar usuarios: ' + error.message);
  }
  
};


/**
 * Elimina un usuario por su ID.
 * @param {string} userId - El ID del usuario a eliminar
 * @returns {Promise<object>} - Devuelve el resultado de la consulta
 */
const deleteUserById = async (userId) => {
  const query = 'DELETE FROM public.user_list WHERE id = $1'; // Cambia 'id' por el nombre de la columna de tu PK
  const result = await pool.query(query, [userId]);
  return result;
};


/**
 * Elimina un usuario por su username.
 * @param {string} username - El username del usuario a eliminar
 * @returns {Promise<object>} - Devuelve el resultado de la consulta
 */
const deleteUserByUsername = async (username) => {
  const query = 'DELETE FROM public.user_list WHERE username = $1'; // Asegúrate de que 'username' es el nombre correcto de la columna
  const result = await pool.query(query, [username]);
  return result;
};



// Exportar las funciones
module.exports = {
  findUserByUsername,
  findUserByEmail,
  checkIfAdmin,
  createUser,
  verifyUsers,
  deleteUserById,
  deleteUserByUsername,
};
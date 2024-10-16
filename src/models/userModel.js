const pool = require('../config/database');

/**
 * Buscar usuario por username en la base de datos
 * @param {string} username - El username a buscar
 * @returns {Promise<object>} - Devuelve un Promise con los datos de usuario.
 */
const findUserByUsername = async (username) => {
  try {
    const query = 'SELECT * FROM public.user_list WHERE username = $1';
    const values = [username];
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null; // Si el usuario no se encuentra
    }
  } catch (error) {
    throw new Error('Database query error');
  }
};


/**
 * Check if the user is an admin by looking for their user_id in the admin_list table
 * @param {string} user_id - The ID of the user to check
 * @returns {Promise<boolean>} - Returns true if the user is an admin, false otherwise
 */
const checkIfAdmin = async (user_id) => {
  try {
    const query = 'SELECT * FROM public.admin_list WHERE user_id = $1';
    const values = [user_id];
    const result = await pool.query(query, values);

    return result.rows.length > 0; // Return true if user is found in admin_list
  } catch (error) {
    throw new Error('Database query error');
  }
};


module.exports = {
  findUserByUsername,
  checkIfAdmin
};

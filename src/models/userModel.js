const pool = require('../config/database');

/**
 * Buscar usuario por username en la base de datos
 * @param {string} username - El username a buscar
 * @returns {Promise<object>} - Devuelve un Promise con los datos de usuario.
 */
const findUserByUsername = async (username) => {
  try {
    const query = 'SELECT * FROM user_list WHERE username = $1';
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

module.exports = {
  findUserByUsername,
};

const pool = require('../config/database');

/**
 * Find a user by username in the database
 * @param {string} username - The username to search for
 * @returns {Promise<object>} - Returns a promise that resolves with the user data if found
 */
const findUserByUsername = async (username) => {
  try {
    const query = 'SELECT * FROM user_list WHERE username = $1';
    const values = [username];
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null; // User not found
    }
  } catch (error) {
    throw new Error('Database query error');
  }
};

module.exports = {
  findUserByUsername,
};

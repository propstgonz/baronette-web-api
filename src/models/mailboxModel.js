const pool = require('../config/mailDatabase'); // Conexión a maildb
const crypt = require('unix-crypt-td-js');

/**
 * Registrar un nuevo correo en mailbox
 * @param {string} email
 * @param {string} password
 * @returns {Promise<void>}
 */
const createMailboxUser = async (email, password) => {
  const hashedPassword = crypt(password, '{SHA512-CRYPT}');
  const query = `
    INSERT INTO public.mailbox (email, password, active, last_modified)
    VALUES ($1, $2, true, NOW())
  `;
  const values = [email, hashedPassword];
  await pool.query(query, values);
};

module.exports = {
  createMailboxUser,
};

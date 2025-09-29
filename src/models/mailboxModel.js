const pool = require('../config/mailDatabase'); // Conexión a maildb
const unixCrypt = require('unix-crypt-td-js');

/**
 * Generar hash en formato SHA512-CRYPT compatible con Dovecot/Postfix
 * @param {string} password
 * @returns {string} hash con prefijo {SHA512-CRYPT}
 */
function hashPassword(password) {
  // Salt aleatorio: SHA512-CRYPT requiere que empiece por "$6$"
  const salt = "$6$" + Math.random().toString(36).slice(2, 10);
  const hash = unixCrypt(password, salt);
  return `{SHA512-CRYPT}${hash}`;
}

/**
 * Registrar un nuevo correo en mailbox
 * @param {string} email
 * @param {string} password
 * @returns {Promise}
 */
async function registerMailbox(email, password) {
  const client = await pool.connect();
  try {
    const hashedPassword = hashPassword(password);

    const query = `
      INSERT INTO "mailbox" (username, password, domain, local_part, name, quota, is_active, is_admin)
      VALUES ($1, $2, split_part($1, '@', 2), split_part($1, '@', 1), '', 0, true, false)
      RETURNING *
    `;

    const values = [email, hashedPassword];
    const result = await client.query(query, values);

    return result.rows[0];
  } catch (err) {
    console.error("❌ Error registrando mailbox:", err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  registerMailbox,
};

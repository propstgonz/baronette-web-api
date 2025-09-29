const pool = require('../config/mailDatabase');
const crypto = require('crypto');
const sha512crypt = require('sha512crypt-node'); // npm install sha512crypt-node

// Generar salt válido
function genSalt(len = 16) {
  const chars = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const bytes = crypto.randomBytes(len);
  let s = '';
  for (let i = 0; i < len; i++) {
    s += chars[bytes[i] % chars.length];
  }
  return s;
}

/**
 * Registrar un nuevo correo en mailbox
 * @param {string} email
 * @param {string} password
 * @param {number} [rounds=5000] - número de rondas (default 5000, como crypt(3))
 */
const createMailboxUser = async (email, password, rounds = 5000) => {
  const salt = genSalt(16);

  // Salt con rondas explícitas
  const fullSalt = `$6$rounds=${rounds}$${salt}`;

  // Generar hash estilo crypt(3)
  const cryptHash = sha512crypt(password, fullSalt);

  // Guardar con prefijo {SHA512-CRYPT}, como espera Dovecot
  const hashedPassword = `{SHA512-CRYPT}${cryptHash}`;

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

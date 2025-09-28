const pool = require('../config/mailDatabase');
const unixCryptTD = require('unix-crypt-td-js');
const crypto = require('crypto');

const createMailboxUser = async (email, password) => {
  // Generar un salt aleatorio de 16 caracteres válidos
  const salt = crypto.randomBytes(12)           // 12 bytes → ~16 chars base64
    .toString('base64')
    .replace(/\+/g, '.')                         // reemplazar + y / por .
    .replace(/\//g, '.')
    .slice(0, 16);

  // Formato completo SHA512-CRYPT: $6$salt$
  const fullSalt = `$6$${salt}$`;

  // Generar el hash completo
  const hashedPassword = `{SHA512-CRYPT}${unixCryptTD(password, fullSalt)}`;

  // Guardar en DB
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

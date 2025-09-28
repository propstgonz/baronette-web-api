const pool = require('../config/mailDatabase');
const unixCryptTD = require('unix-crypt-td-js');

const createMailboxUser = async (email, password) => {
  // Generar un salt aleatorio de 16 caracteres
  const salt = [...Array(16)]
    .map(() => Math.floor(Math.random() * 36).toString(36))
    .join('');

  // Hash en formato Postfix/Dovecot: {SHA512-CRYPT}$6$salt$hash
  const hash = unixCryptTD(password, `$6$${salt}$`);
  const hashedPassword = `{SHA512-CRYPT}${hash}`;

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

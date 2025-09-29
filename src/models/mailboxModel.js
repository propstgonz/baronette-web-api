const pool = require('../config/mailDatabase');
const unixCryptTD = require('unix-crypt-td-js');

const createMailboxUser = async (email, password) => {
  // Salt de 16 caracteres válidos para crypt(3)
  const saltChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./';
  let salt = '';
  for (let i = 0; i < 16; i++) {
    salt += saltChars.charAt(Math.floor(Math.random() * saltChars.length));
  }
  const fullSalt = `$6$${salt}$`;

  // Hash compatible con Postfix/Dovecot
  const hashedPassword = `{SHA512-CRYPT}${unixCryptTD(password, fullSalt)}`;

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

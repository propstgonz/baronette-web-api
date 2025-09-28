const pool = require('../config/mailDatabase');
const unixCryptTD = require('unix-crypt-td-js');

const createMailboxUser = async (email, password) => {
  // Generar hash SHA512-CRYPT compatible con Postfix
  const salt = `$6$${Math.random().toString(36).substring(2, 15)}`;
  const hashedPassword = `{SHA512-CRYPT}${unixCryptTD(password, salt)}`;

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

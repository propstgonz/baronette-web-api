import pool from '../config/mailDatabase.js'; // Conexión a maildb
import { execSync } from 'child_process';
import crypto from 'crypto';

/**
 * Generar hash en formato SHA512-CRYPT compatible con Dovecot/Postfix
 * @param {string} password
 * @returns {string} hash con prefijo {SHA512-CRYPT}
 */
function hashPassword(password) {
  // Generar salt aleatorio de 16 caracteres
  const salt = crypto.randomBytes(12).toString('base64').slice(0, 16);
  
  // Usar doveadm para generar el hash (método más confiable)
  try {
    const hash = execSync(`doveadm pw -s SHA512-CRYPT -p '${password.replace(/'/g, "'\\''")}'`, { encoding: 'utf-8' }).trim();
    return hash;
  } catch {
    // Fallback: usar formato BLF-CRYPT que Dovecot también acepta
    const bcrypt = require('bcrypt');
    const hash = bcrypt.hashSync(password, 10);
    return `{BLF-CRYPT}${hash}`;
  }
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

export {
  registerMailbox,
};

const { Pool } = require('pg');
require('dotenv').config();

const mailPool = new Pool({
  user: process.env.MAILDB_USER,
  host: process.env.MAILDB_HOST,
  database: process.env.MAILDB_NAME,
  password: process.env.MAILDB_PASSWORD,
  port: process.env.MAILDB_PORT,
});

module.exports = mailPool;

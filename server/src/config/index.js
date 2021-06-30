require('dotenv').config();
const os = require('os');

const config = {
  db_host: process.env.PRO_DB,
  db_name: process.env.DB_NAME,
  ssl_key: process.env.SSL_KEY,
  ssl_cert: process.env.SSL_CERT,
  serverPort: process.env.SERVER_PORT,
  debugging_mode: false,
  server_image_path: 'img',
  VERSION: '1.0.50',
};

module.exports = config;

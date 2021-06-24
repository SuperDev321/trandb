require('dotenv').config();
const mysql = require('mysql');
const config = {
    db_host: process.env.SERVER_DB_HOST,
    db_user: process.env.SERVER_DB_USER,
    db_pass: process.env.SERVER_DB_PASS,
    db_name: process.env.SERVER_DB_NAME,
};



// db connect
let con = mysql.createConnection({
    host: config.db_host,
    user: config.db_user,
    password: config.db_pass,
    database: config.db_name,
    charset: 'utf8mb4'
});

con.connect(function(err) {
    // if (err) throw err;
});
module.exports = con;
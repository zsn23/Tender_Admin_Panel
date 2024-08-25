const mysql = require('mysql');

const dbConfig = {
  host: '127.0.0.1', // Specify host separately
  port: 3306,        // Specify port separately
  user: 'root',
  password: '',
  database: 'tender786_live'
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;

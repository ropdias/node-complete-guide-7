const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'node-user',
  database: 'node-complete',
  password: 'nodecomplete'
});

module.exports = pool.promise();
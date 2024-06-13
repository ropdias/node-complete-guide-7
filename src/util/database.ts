// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'node-user',
//   database: 'node-complete',
//   password: 'nodecomplete'
// });

// module.exports = pool.promise();

// const Sequelize = require('sequelize');
// Sequelize is now a named import instead of the default import, so you should
// use the following to make intellisense work:
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('node-complete', 'node-user', 'nodecomplete', {
  dialect: 'mysql',
  host: 'localhost',
});

// This is like a connection pool from the mysql2 but with extra features
module.exports = sequelize;

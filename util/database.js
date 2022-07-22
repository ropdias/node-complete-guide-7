const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "node-user", "nodecomplete", {
  dialect: "mysql",
  host: "localhost",
});

// This is like a connection pool from the mysql2 but with extra features
module.exports = sequelize;

const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  // localhost's mysql
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    timezone: "+09:00",
    dialect: "mysql",
  },
  // ec2's mysql
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    timezone: "+09:00",
    dialect: "mysql",
  },
  // ec2's mysql(deploy)
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    timezone: "+09:00",
    dialect: "mysql",
  },
};

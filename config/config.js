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
    username: process.env.DB_USER_T,
    password: process.env.DB_PASSWORD_T,
    database: process.env.DB_DATABASE_T,
    host: process.env.DB_HOST_T,
    timezone: "+09:00",
    dialect: "mysql",
  },
  // ec2's mysql(deploy)
  production: {
    username: process.env.DB_USER_T,
    password: process.env.DB_PASSWORD_T,
    database: process.env.DB_DATABASE_T,
    host: process.env.DB_HOST_T,
    timezone: "+09:00",
    dialect: "mysql",
  },
};

const db = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const pool = db.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  wateForConnections: true,
  connectionLimit: 5,
});

module.exports = {
  getConn: () => pool.getConnection(),
};

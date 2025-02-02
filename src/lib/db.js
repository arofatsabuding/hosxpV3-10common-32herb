import mysql from "mysql2/promise";

//env
const MYSQL_HOSTNAME = process.env.MYSQL_HOSTNAME;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASS = process.env.MYSQL_PASS;
const MYSQL_DB = process.env.MYSQL_DB;
const MySQL_PORT = process.env.MYSQL_PORT;
//env

// สร้าง Connection Pool (ดีกว่า connection ปกติ)
const pool = mysql.createPool({
    host: MYSQL_HOSTNAME,
    user: MYSQL_USER,
    password: MYSQL_PASS,
    database: MYSQL_DB,
    port: MySQL_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: "tis620",
  });

export default pool;

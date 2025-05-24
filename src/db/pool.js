import mysql from "mysql2/promise";
import process from "node:process";

const connectionSettings = {
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
};

export const connectionPool = mysql.createPool(connectionSettings);

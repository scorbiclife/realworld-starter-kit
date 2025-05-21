import mysql from "mysql2/promise";
import process from "node:process";

const connectionSettings = {
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
};
const connection = await mysql.createConnection(connectionSettings);

try {
  const [results, fields] = await connection.query("select 1 + 1;");
  console.log({ results, fields });
} catch (error) {
  console.error(error);
}

connection.end();

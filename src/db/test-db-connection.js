import { connectionPool } from "#src/db/pool.js";

try {
  const connection = await connectionPool.getConnection();
  const [results, fields] = await connection.query("select 1 + 1;");
  console.log({ results, fields });
  connection.release();
} catch (error) {
  console.error(error);
}

connectionPool.end();

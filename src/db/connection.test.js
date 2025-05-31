import { describe, test } from "@jest/globals";
import { connectionPool } from "#src/db/pool.js";

describe("database connection", () => {
  test("works", async () => {
    const connection = await connectionPool.getConnection();
    const [results, fields] = await connection.query("select 1 + 1;");
    console.log({ results, fields });
    connection.release();
    connectionPool.end();
  });
});

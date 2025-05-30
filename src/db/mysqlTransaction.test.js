import {
  describe,
  test,
  expect,
  afterAll,
  beforeAll,
  beforeEach,
  afterEach,
} from "@jest/globals";
import mysql from "mysql2/promise";

import { connectionSettings } from "#src/db/connectionSettings.js";

import {
  runAndRollback,
  runInTransaction,
} from "./mysqlTransaction.js";

describe("MysqlTransactionWrapper", () => {
  /**
   * Note: we are using DMLs for testing transactions because
   *  [MySQL implicitly commits DDL statements even in a transaction](https://stackoverflow.com/questions/4692690/is-it-possible-to-roll-back-create-table-and-alter-table-statements-in-major-sql)
   */

  let connection;
  let wrapper;

  beforeAll(async () => {
    connection = await mysql.createConnection(connectionSettings);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  beforeEach(async () => {
    await connection.query("DROP TABLE IF EXISTS temporary_table;");
    await connection.query("DROP TABLE IF EXISTS nonexistent_table;");
    await connection.query(
      "CREATE TABLE temporary_table(id bigint not null auto_increment, name varchar(64) not null, primary key (id));"
    );
  });

  afterEach(async () => {
    await connection.query("DROP TABLE temporary_table;");
  });

  describe(runInTransaction.name, () => {
    test("commits a successful transaction", async () => {
      const action = async (connection) => {
        await connection.query(
          "INSERT INTO temporary_table(name) VALUES (('foo'));"
        );
      };
      await runInTransaction(action, connection);
      const [result] = await connection.query("SELECT * from temporary_table;");
      expect(result.length).toBe(1);
    });

    test("rolls back and throws on an unsuccessful transaction", async () => {
      try {
        const action = async (connection) => {
          await connection.query(
            "INSERT INTO temporary_table VALUES (('foo'));"
          );
          const result = await connection.query(
            "SELECT * FROM nonexistent_table;"
          );
          return result;
        };
        await runInTransaction(action, connection);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        const [result] = await connection.query(
          "SELECT * from temporary_table;"
        );
        expect(result.length).toBe(0);
        return;
      }
      throw new Error("Unreachable");
    });
  });

  describe("autoRollback", () => {
    test("rolls back a successful transaction but does not throw", async () => {
      const action = async (connection) => {
        connection.query("INSERT INTO temporary_table(name) VALUES (('foo'));");
      };
      await runAndRollback(action, connection);
      const [result] = await connection.query("SELECT * from temporary_table;");
      expect(result.length).toBe(0);
    });

    test("rolls back and throws on an unsuccessful transaction", async () => {
      try {
        const action = async (connection) => {
          await connection.query(
            "INSERT INTO temporary_table VALUES (('foo'));"
          );
          const result = await connection.query(
            "SELECT * FROM nonexistent_table;"
          );
          return result;
        };
        await runAndRollback(action, connection);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        const [result] = await connection.query(
          "SELECT * from temporary_table;"
        );
        expect(result.length).toBe(0);
        return;
      }
      throw new Error("Unreachable");
    });
  });
});

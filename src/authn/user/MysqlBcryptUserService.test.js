import {
  describe,
  test,
  beforeAll,
  afterAll,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { createPool } from "mysql2/promise";

import { MysqlBcryptUserService } from "./MysqlBcryptUserService.js";
import { MysqlBcryptUserRepository } from "./MysqlBcryptUserRepository.js";
import { runAndRollback, runInTransaction } from "#src/db/mysqlTransaction.js";
import { connectionSettings } from "#src/db/connectionSettings.js";

describe(MysqlBcryptUserService.name, () => {
  /** @type {import("mysql2/promise").Pool} */
  let pool;
  let repository;

  beforeAll(async () => {
    pool = createPool({ ...connectionSettings, connectionLimit: 1 });
    repository = new MysqlBcryptUserRepository();
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    const connection = await pool.getConnection();
    await connection.query("TRUNCATE TABLE `user`;");
    connection.release();
  });

  describe(MysqlBcryptUserService.prototype.register.name, () => {
    test("happy case", async () => {
      const service = new MysqlBcryptUserService({
        connectionPool: pool,
        repository,
      });

      const testTransaction = async (connection) => {
        const result = await service.userRegistrationTask(connection, {
          username: "jake",
          email: "jake@jake.jake",
          password: "valid-password",
        });
        expect(result.success).toBeTruthy();
        // @ts-ignore
        expect(result.user).toBeDefined();
        expect(
          // @ts-ignore
          await result.user?.isValidPassword("valid-password")
        ).toBeTruthy();
        expect(
          // @ts-ignore
          await result.user?.isValidPassword("invalid-password")
        ).toBeFalsy();
      };

      const connection = await pool.getConnection();
      await runAndRollback(testTransaction, connection);
      connection.release();
    });

    test("errors on duplicate email", async () => {
      const service = new MysqlBcryptUserService({
        connectionPool: pool,
        repository,
      });
      const transaction = async (connection) => {
        await service.userRegistrationTask(connection, {
          username: "jake",
          email: "jake@jake.jake",
          password: "valid-password",
        });
        const result = await service.userRegistrationTask(connection, {
          username: "jake",
          email: "jake@jake.jake",
          password: "valid-password",
        });
        expect(result.success).toBeFalsy();
        // @ts-ignore
        expect(result.code).toBe("EXISTING_USER");
      };

      const connection = await pool.getConnection();
      await runAndRollback(transaction, connection);
      connection.release();
    });
  });
});

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

  async function cleanup() {
    const connection = await pool.getConnection();
    connection.query("DELETE from `user` WHERE email = 'jake@jake.jake'");
    connection.release();
  }

  beforeEach(cleanup);
  afterEach(cleanup);

  describe(MysqlBcryptUserService.prototype.register.name, () => {
    test("happy case", async () => {
      const service = new MysqlBcryptUserService({
        connectionPool: pool,
        repository,
        transactionRunner: runAndRollback,
      });
      const result = await service.register({
        username: "jake",
        email: "jake@jake.jake",
        password: "valid-password",
      });
      expect(result.success).toBeTruthy();
      expect(result.user).toBeDefined();
      expect(await result.user?.isValidPassword("valid-password")).toBeTruthy();
      expect(
        await result.user?.isValidPassword("invalid-password")
      ).toBeFalsy();
    });

    test("errors on duplicate email", async () => {
      const service = new MysqlBcryptUserService({
        connectionPool: pool,
        repository,
        transactionRunner: runInTransaction,
      });
      await service.register({
        username: "jake",
        email: "jake@jake.jake",
        password: "valid-password",
      });
      const result = await service.register({
        username: "jake",
        email: "jake@jake.jake",
        password: "valid-password",
      });
      expect(result.success).toBeFalsy();
      expect(result.code).toBe("EXISTING_USER");
    });
  });
});

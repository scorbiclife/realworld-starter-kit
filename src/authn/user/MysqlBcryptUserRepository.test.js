import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import mysql from "mysql2/promise";

import { connectionSettings } from "#src/db/connectionSettings.js";

import { MysqlBcryptUserRepository } from "./MysqlBcryptUserRepository.js";
import { runInTransaction, runAndRollback } from "#src/db/mysqlTransaction.js";

describe(MysqlBcryptUserRepository.name, () => {
  let connection;

  beforeAll(async () => {
    connection = await mysql.createConnection(connectionSettings);
  });

  afterAll(async () => {
    connection.destroy();
  });

  const repo = new MysqlBcryptUserRepository();

  describe(MysqlBcryptUserRepository.prototype.save.name, () => {
    test("succeeds on happy case", async () => {
      const { success, id } = await runAndRollback(
        repo.save.bind(repo),
        connection,
        {
          username: "foo",
          email: "foo@fooverse.com",
          password_hash: "asdf",
        }
      );
      expect(success).toBe(true);
      expect(typeof id).toBe("number");
    });

    test("fails with status `duplicate_user` on duplicate email", async () => {
      const action = async (connection) => {
        // This should pass
        await repo.save(connection, {
          username: "foo",
          email: "foo@fooverse.com",
          password_hash: "asdf",
        });
        // This should not throw because duplicate user is an expected condition
        const { success, status } =
          /** @type {{success: false, status: string}} */ (
            await repo.save(connection, {
              username: "bar",
              email: "foo@fooverse.com",
              password_hash: "qwerty",
            })
          );
        expect(success).toBe(false);
        expect(status).toBe("duplicate_user");
      };
      await runAndRollback(action, connection);
    });
  });
});

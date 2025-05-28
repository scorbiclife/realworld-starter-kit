import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import mysql from "mysql2/promise";

import { connectionSettings } from "#src/db/connectionSettings.js";

import { MysqlBcryptUserRepository } from "./MysqlBcryptUserRepository.js";
import { MysqlTransactionWrapper } from "#src/db/mysqlTransaction.js";

describe(MysqlBcryptUserRepository.name, () => {
  let tx;

  beforeAll(async () => {
    const connection = await mysql.createConnection(connectionSettings);
    tx = new MysqlTransactionWrapper({ connection });
  });

  afterAll(async () => {
    tx.connection.close();
  });

  const repo = new MysqlBcryptUserRepository();

  describe(MysqlBcryptUserRepository.prototype.save.name, () => {
    test("succeeds on happy case", async () => {
      const { success, id } = await tx.autoRollback(repo.save.bind(repo), {
        username: "foo",
        email: "foo@fooverse.com",
        password_hash: "asdf",
      });
      expect(success).toBe(true);
      expect(typeof id).toBe("number");
    });

    test("fails with status `duplicate_user` on duplicate email", async () => {
      await tx.autoRollback(async (connection) => {
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
      });
    });
  });
});

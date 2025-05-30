import { MysqlBcryptUserRepository } from "./MysqlBcryptUserRepository.js";
import { UserService } from "./UserService.js";
import { MysqlTransactionWrapper } from "#src/db/mysqlTransaction.js";
import { BcryptUser } from "./BcryptUser.js";

export class MysqlBcryptUserService extends UserService {
  /**
   *
   * @param {{
   *  mysqlConnectionPool: import("mysql2/promise").Pool
   *  repository: MysqlBcryptUserRepository
   * }} param0
   */
  constructor({ mysqlConnectionPool, repository }) {
    super();
    this.connectionPool = mysqlConnectionPool;
    this.repository = repository;
  }

  async register({ username, email, password }) {
    const connection = this.connectionPool.getConnection();
    const tx = new MysqlTransactionWrapper({ connection });
    const user = await BcryptUser.fromJson({ username, email, password });
    const result = await tx.runAsTransaction(async (connection) => {
      return await this.repository.save(connection, {
        username,
        email,
        password_hash: user.passwordHash,
      });
    });
    if (result.success) {
      return /** @type {const} */ ({ success: true, user });
    }
    if (result.status === "duplicate_user") {
      return /** @type {const} */ ({ success: false, code: "EXISTING_USER" });
    }
    throw new Error("Unreachable");
  }
}

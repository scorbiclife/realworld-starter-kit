import { MysqlBcryptUserRepository } from "./MysqlBcryptUserRepository.js";
import { UserService } from "./UserService.js";
import { BcryptUser } from "./BcryptUser.js";

export class MysqlBcryptUserService extends UserService {
  /**
   *
   * @param {{
   *  connectionPool: import("mysql2/promise").Pool
   *  repository: MysqlBcryptUserRepository
   *  transactionRunner: import("#src/db/transaction.js").TransactionRunner
   * }} param0
   */
  constructor({ connectionPool, repository, transactionRunner }) {
    super();
    this.connectionPool = connectionPool;
    this.repository = repository;
    this.transactionRunner = transactionRunner;
  }

  async register({ username, email, password }) {
    const connection = await this.connectionPool.getConnection();
    const user = await BcryptUser.fromJson({ username, email, password });
    const action = async (connection) => {
      return await this.repository.save(connection, {
        username,
        email,
        password_hash: user.passwordHash,
      });
    };
    try {
      const result = await this.transactionRunner(action, connection);
      if (result.success) {
        return /** @type {const} */ ({ success: true, user });
      }
      if (result.status === "duplicate_user") {
        return /** @type {const} */ ({ success: false, code: "EXISTING_USER" });
      }
      throw new Error("Unreachable");
    } finally {
      connection.release();
    }
  }
}

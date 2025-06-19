import { MysqlBcryptUserRepository } from "./MysqlBcryptUserRepository.js";
import { UserService } from "./UserService.js";
import { BcryptUser } from "./BcryptUser.js";
import { runInTransaction } from "#src/db/mysqlTransaction.js";
import logger from "#src/logger/index.js";

export class MysqlBcryptUserService extends UserService {
  /**
   *
   * @param {{
   *  connectionPool: import("mysql2/promise").Pool
   *  repository: MysqlBcryptUserRepository
   * }} param0
   */
  constructor({ connectionPool, repository }) {
    super();
    this.connectionPool = connectionPool;
    this.repository = repository;
  }

  /**
   * @param {{ username: string, email: string, password: string }} param0 
   * @returns {Promise<
   *  | { success: true, user: BcryptUser }
   *  | { success: false, code: "EXISTING_USER" }
   *  | { success: false, code: "UNKNOWN_ERROR" }
   * >}
   */
  async register({ username, email, password }) {
    const connection = await this.connectionPool.getConnection();
    try {
      return await runInTransaction(this.userRegistrationTask, connection, {
        username,
        email,
        password,
      });
    } finally {
      connection.release();
    }
  }

  /**
   * Used an arrow function for easier use in transaction wrappers that accept a free function.
   * @param {import("mysql2/promise").Connection} connection
   * @returns {Promise<
   *  | { success: true, user: BcryptUser }
   *  | { success: false, code: "EXISTING_USER" }
   *  | { success: false, code: "UNKNOWN_ERROR" }
   * >}
   */
  userRegistrationTask = async (connection, { username, email, password }) => {
    const user = await BcryptUser.fromJson({ username, email, password });
    const result = await this.repository.save(connection, {
      username,
      email,
      password_hash: user.passwordHash,
    });
    if (result.success) {
      return /** @type {const} */ ({ success: true, user });
    }
    if (result.status === "duplicate_user") {
      return /** @type {const} */ ({ success: false, code: "EXISTING_USER" });
    }
    return /** @type {const} */ ({ success: false, code: "UNKNOWN_ERROR" });
  };
}

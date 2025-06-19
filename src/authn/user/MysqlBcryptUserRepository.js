import logger from "#src/logger/index.js";
import { UserRepository } from "./UserRepository.js";

export class MysqlBcryptUserRepository extends UserRepository {
  /**
   *
   * @param {import("mysql2/promise").Connection} connection
   * @param {{username: string, email: string, password_hash: string}} param1
   * @returns {Promise<
   *  | { success: true, id: number }
   *  | { success: false, status: "duplicate_user"}
   *  | { success: false, status: "unknown_error" }>}
   * @throws - unexpected errors
   */
  async save(connection, { username, email, password_hash }) {
    let results;
    let rows;
    try {
      [results, rows] = await connection.execute(
        "insert into `user` (username, email, password_hash) values (?, ?, ?);",
        [username, email, password_hash]
      );
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        // case: user already exists
        return { success: false, status: "duplicate_user" };
      }
      // don't log sensitive information
      logger.logError(error, {
        message: "Unexpected error while saving user",
      });
      return { success: false, status: "unknown_error" };
    }
    let id;
    try {
      // @ts-ignore
      [[{ id }]] = await connection.execute(
        "select id from `user` where email = ?;",
        [email]
      );
    } catch (error) {
      // Don't log sensitive information
      logger.logError(error, {
        message: "Unexpected error while retrieving user id after save",
      });
      return { success: false, status: "unknown_error" };
    }
    return { success: true, id };
  }
}

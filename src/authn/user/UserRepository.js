import logger from "#src/logger/index.js";

export class UserRepository {
  /**
   *
   * @param {import("mysql2/promise").Connection} connection
   * @param {{username: string, email: string, password_hash: string}} param1
   * @returns {Promise<
   *  | { success: true, id: number }
   *  | { success: false, status: "duplicate_user"}
   *  | { success: false, status: "unknown_error" }>}
   */
  async save(connection, { username, email, password_hash }) {
    logger.error("UserRepository.save not implemented");
    throw new Error("Not Implemented");
  }
}

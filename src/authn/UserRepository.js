export class UserRepository {
  /**
   *
   * @param {import("mysql2/promise").Connection} connection
   * @param {{username: string, email: string, password_hash: string}} param1
   * @returns {Promise<{ status: "success", id: number } | { status: "duplicate_user"}>}
   * @throws - unexpected errors
   */
  async save(connection, { username, email, password_hash }) {
    throw new Error("Not Implemented");
  }
}

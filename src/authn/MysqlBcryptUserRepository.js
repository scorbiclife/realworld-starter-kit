import { UserRepository } from "./UserRepository.js";

export class MysqlBcryptUserRepository extends UserRepository {
  /**
   *
   * @param {import("mysql2/promise").Connection} connection
   * @param {{username: string, email: string, password_hash: string}} param1
   * @returns {Promise<{ status: "success", id: number } | { status: "duplicate_user"}>}
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
        return { status: "duplicate_user" };
      }
      throw error;
    }
    // @ts-ignore
    const [[{ id }], _] = await connection.execute(
      "select id from `user` where email = ?;",
      [email]
    );
    return { status: "success", id };
  }
}

import logger from "#src/logger/index.js";
import { User } from "./User.js";

export class UserService {
  /**
   * @param {{username: string, email: string, password: string}} param0
   * @returns {Promise<
   *  | { success: true, user: User }
   *  | { success: false, code: "EXISTING_USER" }
   *  | { success: false, code: "UNKNOWN_ERROR" }
   * >}
   */
  async register({ username, email, password }) {
    logger.error("UserService.register not implemented");
    throw new Error("Not Implemented");
  }
}

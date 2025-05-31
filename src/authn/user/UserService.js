import { User } from "./User.js";

export class UserService {
  /**
   * @param {{username: string, email: string, password: string}} param0
   * @returns {Promise<
   *  | { success: true, user: User }
   *  | { success: false, code: "EXISTING_USER" }
   * >}
   */
  async register({ username, email, password }) {
    throw new Error("Not Implemented");
  }
}

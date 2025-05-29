import { BcryptUser } from "./BcryptUser.js";
import { UserService } from "./UserService.js";

export class InMemoryBcryptUserService extends UserService {
  constructor({ bcryptRounds = 10 }) {
    super();
    this.users = [];
  }

  /**
   * @param {{username: string, email: string, password: string}} param0
   * @returns
   */
  async register({ username, email, password }) {
    const user = await BcryptUser.fromJson({
      username,
      email,
      password,
    });
    if (this.findOneByEmail({ email })) {
      return /** @type {const} */ ({ success: false, code: "EXISTING_USER" });
    }
    this.users.push(user);
    return /** @type {const} */ ({ success: true, user: user });
  }

  findOneByEmail({ email }) {
    return this.users.find((user) => user.email === email) ?? null;
  }
}

import bcrypt from "bcrypt";
import { User } from "./User.js";

export class BcryptUser extends User {
  constructor({ username, email, passwordHash }) {
    super();
    this.username = username;
    this.email = email;
    this.passwordHash = passwordHash;
  }

  // Extend this class to override the rounds
  static rounds = 10;

  static async fromJson({ username, email, password }) {
    const passwordHash = await bcrypt.hash(password, this.rounds);
    return new BcryptUser({ username, email, passwordHash });
  }

  async isValidPassword(givenPassword) {
    const match = await bcrypt.compare(givenPassword, this.passwordHash);
    return match;
  }
}

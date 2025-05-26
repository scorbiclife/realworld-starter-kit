import bcrypt from "bcrypt";

export class BcryptUser {
  constructor({ username, passwordHash }) {
    this.username = username;
    this.passwordHash = passwordHash;
  }

  // Extend this class to override the rounds
  static rounds = 10;

  static async fromUsernameAndPassword({ username, password }) {
    const passwordHash = await bcrypt.hash(password, this.rounds);
    return new BcryptUser({ username, passwordHash });
  }

  async isValidPassword(givenPassword) {
    const match = await bcrypt.compare(givenPassword, this.passwordHash);
    return match;
  }
}

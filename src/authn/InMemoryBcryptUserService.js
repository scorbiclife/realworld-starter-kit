import { BcryptUser } from "./BcryptUser.js";

export class InMemoryBcryptUserService {
  constructor({ bcryptRounds = 10 }) {
    this.userClass = class extends BcryptUser {
      static rounds = bcryptRounds;
    };
    this.users = [];
  }

  async register({ username, password }) {
    const user = await this.userClass.fromUsernameAndPassword({
      username,
      password,
    });
    this.users.push(user);
  }

  findOne({ username }) {
    return this.users.find((user) => user.username === username) ?? null;
  }
}

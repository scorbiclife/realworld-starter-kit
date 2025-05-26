import { promisify } from "node:util";
import crypto from "node:crypto";

export class Pbkdf2User {
  static async hash({
    password,
    salt,
    hashSettings: { iterations, keylen, digest },
  }) {
    return await promisify(crypto.pbkdf2)(
      password,
      salt,
      iterations,
      keylen,
      digest
    );
  }

  constructor({ username, passwordSalt, passwordHash, hashSettings }) {
    this.username = username;
    this.passwordSalt = passwordSalt;
    this.passwordHash = passwordHash;
    this.hashSettings = hashSettings;
  }

  static async fromUsernameAndPassword({ username, password, hashSettings }) {
    const salt = crypto.randomBytes(32);
    const passwordHash = await Pbkdf2User.hash({
      password,
      salt,
      hashSettings,
    });
    return new Pbkdf2User({
      username,
      passwordSalt: salt,
      passwordHash,
      hashSettings,
    });
  }

  async isValidPassword(givenPassword) {
    // Code derived from: https://www.passportjs.org/tutorials/password/verify/
    const givenPasswordHash = await Pbkdf2User.hash({
      password: givenPassword,
      salt: this.passwordSalt,
      hashSettings: this.hashSettings,
    });
    return crypto.timingSafeEqual(this.passwordHash, givenPasswordHash);
  }
}

export class InMemoryUserService {
  constructor({ iterations = 310000, keylen = 32, digest = "sha256" }) {
    this.users = [];
    this.hashSettings = Object.freeze({
      iterations,
      keylen,
      digest,
    });
  }

  async register({ username, password }) {
    const user = await Pbkdf2User.fromUsernameAndPassword({
      username,
      password,
      hashSettings: this.hashSettings,
    });
    this.users.push(user);
  }

  findOne({ username }) {
    return this.users.find((user) => user.username === username) ?? null;
  }
}

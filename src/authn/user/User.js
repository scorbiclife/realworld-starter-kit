import logger from "#src/logger/index.js";

export class User {
  /**
   * @param {string} givenPassword
   * @returns {Promise<boolean>}
   */
  async isValidPassword(givenPassword) {
    logger.error("User.isValidPassword not implemented");
    throw new Error("Not Implemented");
  }
}

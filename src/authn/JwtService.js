import jwt from "jsonwebtoken";

/**
 * JWT service using HS256.
 *
 * NOTE: Using HS256 (symmetric encryption)
 *  because jwt signing and verification happens in the same host anyway.
 *  see also: https://auth0.com/blog/rs256-vs-hs256-whats-the-difference/
 */
export class Hs256JwtService {
  /**
   * @param {object} param0
   * @property {string} param0.secret
   * @property {(string|number)=} param0.expiresIn - expiry time,
   *  this should be kept short because we don't plan to revoke jwts.
   *  See https://www.npmjs.com/package/jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
   *  for the exact values that are allowed.
   */
  constructor({ secret, expiresIn = "10m" }) {
    this.secret = secret;
    this.expiresIn = expiresIn;
    this.algorithm = /** @type {const} */ ("HS256");
  }

  async sign({ username, email }) {
    const token = await jwt.sign({ username, email }, this.secret, {
      algorithm: this.algorithm,
      expiresIn: this.expiresIn,
    });
    return token;
  }

  async verify(token) {
    const payload = await jwt.verify(token, this.secret, {
      algorithms: ["HS256"],
    });
    return payload;
  }
}

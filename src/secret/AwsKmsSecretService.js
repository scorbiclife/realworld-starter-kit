import { KMSClient, DecryptCommand, EncryptCommand } from "@aws-sdk/client-kms";
import logger from "#src/logger/index.js";

export class AwsKmsSecretService {
  /**
   * @param {object} options
   * @param {string} options.keyId - The KMS key id. Parameterized just in case a different key is needed.
   */
  constructor({ keyId }) {
    this.keyId = keyId;
    this.kmsClient = new KMSClient({
      region: process.env.AWS_REGION,
    });
  }

  /**
   * @param {string} secret
   * @returns {Promise<string | null>}
   */
  async encrypt(secret) {
    const command = new EncryptCommand({
      KeyId: this.keyId,
      Plaintext: Buffer.from(secret, "base64"),
    });
    let response;
    try {
      response = await this.kmsClient.send(command);
    } catch (error) {
      logger.logError(error);
      return null;
    }
    if (!response || !response.CiphertextBlob) {
      logger.error("No ciphertext received from KMS", { keyId: this.keyId });
      return null;
    }
    return Buffer.from(response.CiphertextBlob).toString("base64");
  }

  /**
   * @param {string} encryptedSecret
   * @returns {Promise<string | null>}
   */
  async decrypt(encryptedSecret) {
    const command = new DecryptCommand({
      KeyId: this.keyId,
      CiphertextBlob: Buffer.from(encryptedSecret, "base64"),
    });
    let response;
    try {
      response = await this.kmsClient.send(command);
    } catch (error) {
      logger.logError(error, { keyId: this.keyId, encryptedSecret });
      return null;
    }
    if (!response || !response.Plaintext) {
      logger.error("No plaintext received from KMS", {
        keyId: this.keyId,
        encryptedSecret,
      });
      return null;
    }
    return Buffer.from(response.Plaintext).toString("base64");
  }
}

import { KMSClient, DecryptCommand, EncryptCommand } from "@aws-sdk/client-kms";

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
   * @returns {Promise<string>}
   */
  async encrypt(secret) {
    const command = new EncryptCommand({
      KeyId: this.keyId,
      Plaintext: Buffer.from(secret, "base64"),
    });
    const response = await this.kmsClient.send(command);
    if (!response.CiphertextBlob) {
      throw new Error("No ciphertext received from KMS");
    }
    return Buffer.from(response.CiphertextBlob).toString("base64");
  }

  /**
   * @param {string} encryptedSecret
   * @returns {Promise<string>}
   */
  async decrypt(encryptedSecret) {
    const command = new DecryptCommand({
      KeyId: this.keyId,
      CiphertextBlob: Buffer.from(encryptedSecret, "base64"),
    });
    const response = await this.kmsClient.send(command);
    if (!response.Plaintext) {
      throw new Error("No plaintext received from KMS");
    }
    return Buffer.from(response.Plaintext).toString("base64");
  }
}

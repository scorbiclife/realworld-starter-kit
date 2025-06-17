import { AwsKmsSecretService } from "./AwsKmsSecretService.js";
import { describe, it, expect } from "@jest/globals";

/**
 * When run locally, run `aws sso login` first.
 */

describe(AwsKmsSecretService.name, () => {
  it("Encrypting then decrypting a secret should be an identity function", async () => {
    const keyId = process.env.AWS_KMS_KEY_ID;
    if (!keyId) {
      throw new Error("AWS_KMS_KEY_ID is not set");
    }
    const provider = new AwsKmsSecretService({ keyId });
    const originalSecret = Buffer.from("this-is-a-secret").toString("base64");
    const encryptedSecret = await provider.encrypt(originalSecret);
    const secret = await provider.decrypt(encryptedSecret);
    expect(secret).toEqual(originalSecret);
  });
});

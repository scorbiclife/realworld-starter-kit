import express from "express";
import bodyParser from "body-parser";

import { makeRouter as makeAuthnRouter } from "#src/authn/index.js";
import { Hs256JwtService } from "#src/authn/JwtService.js";
import { InMemoryBcryptUserService } from "#src/authn/user/InMemoryBcryptUserService.js";
import { AwsKmsSecretService } from "#src/secret/AwsKmsSecretService.js";

const keyId = process.env.AWS_KMS_KEY_ID;
if (!keyId) {
  throw new Error("AWS_KMS_KEY_ID is not set");
}
const defaultSecretService = new AwsKmsSecretService({ keyId });

const encryptedJwtSecret = process.env.ENCRYPTED_JWT_SECRET;
if (!encryptedJwtSecret) {
  throw new Error("ENCRYPTED_JWT_SECRET is not set");
}
const jwtService = new Hs256JwtService({
  secret: defaultSecretService.decrypt(encryptedJwtSecret),
  expiresIn: "10m",
});

const userService = new InMemoryBcryptUserService({});

const authnRouter = makeAuthnRouter({
  jwtService,
  userService,
});

export const app = express();

app.use(bodyParser.json());

app.use("/api/users", authnRouter);
app.use("/", (req, res) => {
  res.json({ message: "hello world" });
  return;
});

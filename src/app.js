import express from "express";
import bodyParser from "body-parser";

import { makeRouter as makeAuthnRouter } from "#src/authn/index.js";
import { Hs256JwtService } from "#src/authn/JwtService.js";
import { InMemoryBcryptUserService } from "#src/authn/user/InMemoryBcryptUserService.js";
import { AwsKmsSecretService } from "#src/secret/AwsKmsSecretService.js";
import logger from "#src/logger/index.js";

const keyId = process.env.AWS_KMS_KEY_ID;
if (!keyId) {
  logger.error("AWS_KMS_KEY_ID is not set");
  throw new Error("AWS_KMS_KEY_ID is not set");
}
const defaultSecretService = new AwsKmsSecretService({ keyId });

// Initialize JWT service

const encryptedJwtSecret = process.env.ENCRYPTED_JWT_SECRET;
if (!encryptedJwtSecret) {
  logger.error("ENCRYPTED_JWT_SECRET is not set");
  throw new Error("ENCRYPTED_JWT_SECRET is not set");
}
const secret = await defaultSecretService.decrypt(encryptedJwtSecret);
if (!secret) {
  logger.error("Failed to decrypt JWT secret");
  throw new Error("Failed to decrypt JWT secret");
}
const jwtService = new Hs256JwtService({
  secret,
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

// Global error handler
app.use((error, req, res, next) => {
  res.status(500).json({
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { error: error.message }),
  });
});

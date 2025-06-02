import express from "express";
import bodyParser from "body-parser";

import { makeRouter as makeAuthnRouter } from "#src/authn/index.js";
import { Hs256JwtService } from "./authn/JwtService.js";
import { InMemoryBcryptUserService } from "./authn/user/InMemoryBcryptUserService.js";

const jwtService = new Hs256JwtService({
  secret: process.env.JWT_SECRET,
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

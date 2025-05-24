import { describe, test, expect } from "@jest/globals";
import express from "express";
import bodyParser from "body-parser";
import supertest from "supertest";

import { Hs256JwtService } from "./JwtService.js";
import { makeRouter } from "./index.js";
import { InMemoryUserService } from "./InMemoryUserService.js";

const TEST_JWT_SECRET = "test-jwt-secret";
const testJwtService = new Hs256JwtService({
  secret: TEST_JWT_SECRET,
  expiresIn: "10m",
});

const testUserService = new InMemoryUserService({
  iterations: 100,
});
await testUserService.register({ username: "Jacob", password: "jakejake" });

const app = express();
app.use(bodyParser.json());
app.use(
  "/",
  makeRouter({
    jwtService: testJwtService,
    userService: testUserService,
  })
);

describe("authentication", () => {
  test("on request without user info, responds with 400", async () => {
    const response = await supertest(app)
      .post("/")
      .send({
        user: {
          username: "Jacob",
          email: "jake@jake.jake",
        },
      })
      .set("Accept", "application/json");
    expect(response.status).toStrictEqual(400);
  });

  test("on valid user login, responds with 200 with the expected return type", async () => {
    const response = await supertest(app)
      .post("/")
      .send({
        user: {
          username: "Jacob",
          email: "jake@jake.jake",
          password: "jakejake",
        },
      })
      .set("Accept", "application/json")
      .expect(200)
      .expect("Content-Type", /json/);
    expect(response?.body?.user).toMatchObject({
      email: "jake@jake.jake",
      username: "Jacob",
      bio: "",
      image: null,
    });
    const token = response?.body?.user?.token;
    expect(typeof token).toStrictEqual("string");
    await expect(testJwtService.verify(token)).resolves.toMatchObject({
      email: "jake@jake.jake",
    });
  });
});

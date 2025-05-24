import { describe, test, expect } from "@jest/globals";
import express from "express";
import bodyParser from "body-parser";
import supertest from "supertest";

import { Hs256JwtService } from "./JwtService.js";
import { makeRouter } from "./index.js";

const TEST_JWT_SECRET = "test-jwt-secret";
const testJwtService = new Hs256JwtService({
  secret: TEST_JWT_SECRET,
  expiresIn: "10m",
});

const app = express();
app.use(bodyParser.json());
app.use("/", makeRouter(testJwtService));

describe("authentication", () => {
  test("user registration succeeds on valid request", async () => {
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
  });

  test("on valid request, server signs a valid JWT token", async () => {
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
    const token = response?.body?.user?.token;
    expect(typeof token).toStrictEqual("string");
    await expect(testJwtService.verify(token)).resolves.toMatchObject({
      email: "jake@jake.jake",
    });
  });

  test("user registration fails on invalid request", async () => {
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
});

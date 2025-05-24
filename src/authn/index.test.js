import { describe, test, expect } from "@jest/globals";
import express from "express";
import bodyParser from "body-parser";
import supertest from "supertest";
import { authnRouter } from "./index.js";

const app = express();
app.use(bodyParser.json());
app.use("/", authnRouter);

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
  test("user registration fails on invalid request", () => {
    supertest(app)
      .post("/")
      .send({
        user: {
          username: "Jacob",
          email: "jake@jake.jake",
        },
      })
      .set("Accept", "application/json")
      .expect(400);
  });
});

import express from "express";
import bodyParser from "body-parser";
import { authnRouter } from "#src/authn/index.js";

export const app = express();

app.use(bodyParser.json());

app.use("/api/users", authnRouter);

app.get("/", (req, res) => {
  res.json("Hello World!");
});

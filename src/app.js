import express from "express";
import { router as userRouter } from "#src/authn/index.js";

export const app = express();

app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.json("Hello World!");
});

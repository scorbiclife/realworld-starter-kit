import express from "express";

export const authnRouter = express.Router();

authnRouter.post("/", [
  function validateRequest(req, res, next) {
    const invalidRequestMessage = {
      message: `Invalid request. Request should be in the form of { "user": { "username": string, "email": string, password: string } }`,
    };
    const validRequest =
      req?.body?.user &&
      typeof req.body.user.username === "string" &&
      typeof req.body.user.email === "string" &&
      typeof req.body.user.password === "string";
    if (!validRequest) {
      res.status(400).json(invalidRequestMessage);
    }
    next();
  },
  function handleRequest(req, res) {
    res.json({
      user: {
        email: req.body.user.email,
        username: req.body.user.username,
        bio: "",
        image: null,
      },
    });
  },
]);

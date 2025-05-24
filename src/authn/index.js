import express from "express";

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
}

function makeAuthMiddleware(jwtService) {
  return async function middleware(req, res) {
    const { email, username, password } = req.body.user;
    let token;
    // JWT signing shouldn't throw
    try {
      token = await jwtService.sign({ username, email, password });
    } catch (error) {
      // TODO: add logger
      res.status(500).json({});
      return;
    }
    const response = {
      user: {
        username,
        token,
        email,
        bio: "",
        image: null,
      },
    };
    res.json(response);
  };
}

export function makeRouter(jwtService) {
  const authnRouter = express.Router();
  authnRouter.post("/", [validateRequest, makeAuthMiddleware(jwtService)]);
  return authnRouter;
}

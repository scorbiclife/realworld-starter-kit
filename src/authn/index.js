import express from "express";
import { Passport } from "passport";
import { Strategy as LocalStrategy } from "passport-local";

function validateRequest(req, res, next) {
  const invalidRequestMessage = {
    message: `Invalid request. Request should be in the form of { "user": { "username": string, "email": string, password: string } }`,
  };
  const validRequest =
    req?.body?.user &&
    typeof req.body.user.email === "string" &&
    typeof req.body.user.password === "string";
  if (!validRequest) {
    return res.status(400).json(invalidRequestMessage);
  }
  next();
}

function makeUserValidationMiddleware({ userService, passport }) {
  async function verify(email, password, done) {
    let user;

    try {
      user = await userService.findOneByEmail({ email });
    } catch (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false);
    }

    try {
      if (!(await user.isValidPassword(password))) {
        return done(null, false);
      }
    } catch (err) {
      return done(err);
    }

    return done(null, user);
  }

  passport.use(
    new LocalStrategy(
      // Accessing nested fields is undocumented but implemented in `passport-local` source
      { usernameField: "user[email]", passwordField: "user[password]" },
      verify
    )
  );
  return passport.authenticate("local", { assignProperty: "user" });
}

function makeJwtMiddleware(jwtService) {
  return async function middleware(req, res) {
    const { username, email } = req.user;
    let token;
    // JWT signing shouldn't throw
    try {
      token = await jwtService.sign({ username, email });
    } catch (error) {
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

export function makeRouter({
  userService,
  jwtService,
  passport = new Passport(),
}) {
  const authnRouter = express.Router();
  authnRouter.post("/", [
    validateRequest,
    makeUserValidationMiddleware({ userService, passport }),
    makeJwtMiddleware(jwtService),
  ]);
  return authnRouter;
}

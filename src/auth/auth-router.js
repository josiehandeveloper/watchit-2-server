const express = require("express");
const AuthService = require("./auth-service");
const authRouter = express.Router();
const jsonParser = express.json();

let knexInstance;

authRouter
  .route("/login")
  .all((req, res, next) => {
    knexInstance = req.app.get("db");
    next();
  })
  .post(jsonParser, (req, res, next) => {
    const { email, password } = req.body;
    const user = { password, email };

    for (const field of ["email", "password"]) {
      if (!req.body[field]) {
        return res.status(400).json({
          error: `Missing ${field}`,
        });
      }
    }
    AuthService.getUserWithEmail(knexInstance, email)
      .then((dbUser) => {
        if (!dbUser)
          return res.status(400).json({
            error: "Incorrect email or password",
          });

        return AuthService.comparePasswords(password, dbUser.password).then(
          (isMatch) => {
            if (!isMatch)
              return res.status(400).json({
                error: "Incorrect email  or password",
              });

            const subject = dbUser.email;
            const payload = { user_id: dbUser.id };
            res.send({
              authToken: AuthService.createJwt(subject, payload),
            });
          }
        );
      })
      .catch(next);
  });

module.exports = authRouter;

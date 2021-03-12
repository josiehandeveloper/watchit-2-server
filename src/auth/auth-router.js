const express = require("express");
const AuthService = require("./auth-service");
// const { requireAuth } = require("../middleware/jwt-auth");

const authRouter = express.Router();
// const jsonBodyParser = express.json();

let knexInstance;

authRouter
  .route("/login")
  .all((req, res, next) => {
    knexInstance = req.app.get("db");
    next();
  })
  .post((req, res, next) => {
    const { email, password } = req.body;
    const user = { password, email };

    for (const [key, value] of Object.entries(user))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });

    AuthService.getUserWithEmail(knexInstance, email)
      .then((dbUser) => {
        if (!dbUser)
          return res.status(400).json({
            error: "Incorrect email or password",
          });

        return AuthService.comparePasswords(password, dbUser.password).then(
          (compareMatch) => {
            if (!compareMatch)
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

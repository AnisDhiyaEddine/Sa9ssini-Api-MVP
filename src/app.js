const express = require("express");
require("./db/mongoose"); //Connect to the database
//Passport setup for further
const app = express();
const userRouter = require("./routers/user");
const skillRouter = require("./routers/skill");
const historyRouter = require("./routers/history");
const authRouter = require("./routers/auth-routes");
const cookieSession = require("cookie-session");
const passport = require("passport");
const passportSetup = require("./services/passport-setup");

app.use(express.json()); //Incoming requests are objects ...  function

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.cookieSessionKey],
  })
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use(userRouter);
app.use(skillRouter);
app.use(historyRouter);

module.exports = app;

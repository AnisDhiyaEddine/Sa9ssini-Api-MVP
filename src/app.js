const express = require("express");
require("./db/mongoose"); //Connect to the database
//Passport setup for further

const app = express();
const userRouter = require("./routers/user");
const skillRouter = require("./routers/skill");
const chatRouter = require("./routers/chat");
const authRouter = require("./routers/auth-routes.js");
const QARouter = require("./routers/QA");

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

app.use(authRouter);
app.use(userRouter);
app.use(skillRouter);
app.use(chatRouter);
app.use(QARouter);

app.set("view engine", "html");
app.engine("html", require("hbs").__express);

module.exports = app;

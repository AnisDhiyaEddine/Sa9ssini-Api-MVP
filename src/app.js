const express = require("express");
require("./db/mongoose"); //Connect to the database
//Passport setup for further
const keys = require("../config/keys");

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
    keys: [keys.cookieKey],
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

if (process.env.NODE_ENV === "development") {
  console.log("Hi we're in buisiness");
  let path = require("path");
  app.use(express.static(path.join(__dirname, "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}
module.exports = app;

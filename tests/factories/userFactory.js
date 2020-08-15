const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userOneId = new mongoose.Types.ObjectId();
const userTwoId = new mongoose.Types.ObjectId();
const githubUserID = new mongoose.Types.ObjectId();
const linkedinUserID = new mongoose.Types.ObjectId();
const configKeys = require("../../config/keys");

const userOne = {
  _id: userOneId,
  userName: "userOne",
  email: "dhiaeboudiaf@gmail.com",
  password: "mypass28",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, configKeys.jwtSecret),
    },
  ],
};

const userTwo = {
  _id: userTwoId,
  userName: "userTwo",
  email: "anistifon@gmail.com",
  password: "mypass28",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, configKeys.jwtSecret),
    },
    {
      token: jwt.sign({ _id: userTwoId }, configKeys.jwtSecret),
    },
    {
      token: jwt.sign({ _id: userTwoId }, configKeys.jwtSecret),
    },
  ],
};

const githubUser = {
  _id: githubUserID,
  userName: "githubuser",
  githubId: "github Id",
};

const linkedinUser = {
  _id: linkedinUserID,
  userName: "userThree",
  linkedinId: "linkedin Id",
};

module.exports = {
  userOneId,
  userTwoId,
  githubUserID,
  linkedinUserID,
  userOne,
  userTwo,
  githubUser,
  linkedinUser,
};

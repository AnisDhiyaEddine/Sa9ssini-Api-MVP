const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/models/user");
const Skill = require("../../src/models/skill");
const puppeteer = require("puppeteer");
const userOneId = new mongoose.Types.ObjectId();
const userTwoId = new mongoose.Types.ObjectId();
const githubUserID = new mongoose.Types.ObjectId();
const linkedinUserID = new mongoose.Types.ObjectId();

const skillId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  userName: "userOne",
  email: "dhiaeboudiaf@gmail.com",
  password: "mypass28",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
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
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
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

const skill = {
  _id: skillId,
  skill: "Skill",
  description: "skill description",
  owner: {
    _id: userOneId,
    userName: userOne.userName,
  },
  evaluation: 0,
  nbrEvaluations: 0,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Skill.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Skill(skill).save();
};

const setupDatabaseOAuth = async () => {
  await User.deleteMany();
  await Skill.deleteMany();
  await new User(githubUser).save();

}; 

module.exports = {
  userOneId,
  userTwoId,
  githubUserID,
  linkedinUserID,
  setupDatabase,
  setupDatabaseOAuth,
  userOne,
  userTwo,
  githubUser,
  linkedinUser,
  skillId,
};

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/models/user");
const Skill = require("../../src/models/skill");
const puppeteer = require("puppeteer");

const userFactory = require("./userFactory");
const skillFactory = require("./skillFactory");

const { userOne, userTwo, githubUser } = userFactory;
const { skill } = skillFactory;

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
  setupDatabase,
  setupDatabaseOAuth,
};

const puppeteer = require("puppeteer");
const sessionFactory = require("./factories/sessionFactory");
const userFactory = require("./factories/userFactory");
const skillFactory = require("./factories/skillFactory");
const app = require("../src/app");
const request = require("supertest");
const User = require("../src/models/user");


const {
  userOneId,
  userTwoId,
  githubUserID,
  linkedinUserID,
  userOne,
  userTwo,
  githubUser,
  linkedinUser,
} = userFactory;

const { skillId, skill } = skillFactory;
const { setupDatabase } = require("./factories/databaseSetupFactory");

let page, browser;
/*
beforeEach(async () => {
  setupDatabaseOAuth();
  browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();

  const { sessionStr, sig } = await sessionFactory(userFactory.githubUserID);
  //I need sessioStr and sig
  await page.setCookie({
    name: "session",
    value: sessionStr,
    domain: "localhost:3000",
  });
  await page.setCookie({
    name: "session.sig",
    value: sig,
    domain: "localhost:3000",
  });

  await page.goto("localhost:3000");
});

afterEach(async () => {
  await browser.close();
});
*/
//Setting up the database before each unit test

//testing the login unit
//----------------------------------------------------------

//----------------------------------------------------------

test("fake session setup", async () => {
  console.log("hello and welcome");
});

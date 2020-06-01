const puppeteer = require("puppeteer");
const sessionFactory = require("./factories/sessionFactory");
const userFactory = require("./factories/userFactory");
const skillFactory = require("./factories/skillFactory");
const databaseSetupFactory = require("./factories/databaseSetupFactory");
const app = require("../src/app");
const request = require("supertest");
const User = require("../src/models/user");
const Page = require("./helpers/page");

//Headless Browser testing .. Coming next!
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
const { setupDatabaseOAuth } = databaseSetupFactory;
let page;
beforeEach(async () => {
  page = await Page.build();
  setupDatabaseOAuth();
});

afterEach(async () => {
 // await page.close();
});
//Setting up the database before each unit test

//testing the login unit
//----------------------------------------------------------

//----------------------------------------------------------

test("fake session setup", async () => {
  await page.login();
  const response = await request(app).get("/users/me");
});

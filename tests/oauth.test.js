const puppeteer = require("puppeteer");

const app = require("../src/app");
const request = require("supertest");
const User = require("../src/models/user");
const {
  githubUserID,
  linkedinUserID,
  setupDatabaseOAuth,
  githubUser,
  linkedinUser,
  skillId,
} = require("../tests/fixtures/db");

let page,browser


beforeEach(async () => {
  setupDatabaseOAuth();
  browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();
  const Buffer = require("safe-buffer").Buffer;
  const id = githubUserID;
  const sessionObj = {
    passport: {
      user: id,
    },
  };
  const sessionStr = Buffer.from(JSON.stringify(sessionObj)).toString("base64");
  const Keygrip = require("keygrip");
  const keys = [process.env.cookieSessionKey];
  const keygrip = new Keygrip(keys);
  const sig = keygrip.sign("session=" + sessionStr);
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

  await page.goto('localhost:3000')
});

afterEach(async () => {
 await browser.close();
});

//Setting up the database before each unit test

//testing the login unit
//----------------------------------------------------------
  
//----------------------------------------------------------
  
test("simple logout", async () => {
 const response = await request(app).post("/auth/logout").send().expect(200);
});
/*  
//testing the getUser unit
//----------------------------------------------------------

//get authenticated user                ...Your profile
test("get authenticated user", async () => {
  await request(app).get("/users/me").send().expect(200);
});

//Get other user profile

test("get other user profile", async () => {
  const response = await request(app)
    .get(`/users/${userTwoId}`)
    .send()
    .expect(200);
  //assertion that we get the right user
  expect(response.body.email).toBe(userTwo.email); //The email is unique valide test
});

//Get other user profile failure
test("get other user profile failure", async () => {
  const response = await request(app).get(`/users/invalidId`).expect(500);
});

//testing the delete unit
//----------------------------------------------------------
test("delete authenticated user", async () => {
  const response = await request(app).delete("/users/me").send().expect(200);

  //Assertion about database update
  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

//testing the Update unit
//----------------------------------------------------------

//update your profile
test("update your profile", async () => {
  const response = await request(app)
    .patch("/users/me")
    .send({
      userName: "UserName updated",
      email: "emailupdated@mail.com",
    })
    .expect(200);
  //Assertion database updated
  const user = await User.findById({ _id: response.body._id });
  expect(user).toMatchObject({
    userName: "UserName updated",
    email: "emailupdated@mail.com",
  });
});

//update profile failed

test("update profile failed", async () => {
  const response = await request(app)
    .patch("/users/me")
    .send({
      _id: "objectUpdated", //Not allowed executed first
    })
    .expect(400);
});

//testing the upload of image unit
//----------------------------------------------------------

test("Upload a profilePicture", async () => {
  await request(app)
    .post("/users/me/profilePicture")
    .attach("profilePicture", "tests/fixtures/test-pic.jpg")
    .expect(200);

  //assert that the profilePicture was stored properly
  const user = await User.findById(userOneId);
  expect(user.profilePict).toEqual(expect.any(Buffer));
});

test("Upload a background picture", async () => {
  const response = await request(app)
    .post("/users/me/backgroundPicture")
    .attach("backgroundPicture", "tests/fixtures/test-pic.jpg")
    .expect(200);

  //assert that the backgroundPicture was stored properly
  const user = await User.findById(userOneId);
  expect(user.backgroundPict).toEqual(expect.any(Buffer));
});

test("update profile picture", async () => {
  const response = await request(app)
    .patch("/users/me/profilePicture")
    .attach("profilePicture", "tests/fixtures/test-pic.jpg")
    .expect(200);
});

test("update background picture", async () => {
  const response = await request(app)
    .patch("/users/me/backgroundPicture")
    .attach("backgroundPicture", "tests/fixtures/test-pic.jpg")
    .expect(200);
});
*/

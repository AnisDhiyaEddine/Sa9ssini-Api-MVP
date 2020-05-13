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
const Skill = require("../src/models/skill");

//Setting up the database before each unit test
beforeEach(setupDatabaseOAuth);

//Add skill unit
//-------------------------------------------------------------------------------
test("Add a skill", async () => {
  const response = await request(app)
    .post("/skills")
    .send({
      skill: "Skill test",
      description: "skill test description",
    })
    .expect(201);
  //Assertion about the update of the database
  const skill = await Skill.findById({ _id: response.body._id });
  expect(skill).not.toBeNull();
});

//get it's own skills unit
//-------------------------------------------------------------------------------

test('get it"s own skills', async () => {
  const response = await request(app)
    .get("/skills/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  //Assertion that the data is valid    checked
  //console.log(response.body)
});

//update skills description unit
//-------------------------------------------------------------------------------

//update your skills description
test("update skill description", async () => {
  const reponse = await request(app)
    .patch(`/skills/me/${skillId}`)
    .send({ description: "Description updated" })
    .expect(200);
});

//update other user description failure
test("update other user descrption", async () => {
  const response = await request(app)
    .patch(`/skills/me/${skillId.toHexString()}`)
    .send({ description: "Description updated" })
    .expect(404);
});

//delete skills unit
//-------------------------------------------------------------------------------

//delete it's own skill
test("delete skill", async () => {
  const response = await request(app)
    .delete(`/skills/${skillId}`)

    .send()
    .expect(200);

  //check that the database was updated
  const skill = await Skill.findById({ _id: skillId });
  expect(skill).toBeNull();
});

//delete other user skill failure
test("delete skill failure", async () => {
  const response = await request(app)
    .delete(`/skills/${skillId}`)

    .send()
    .expect(404);
});

//evaluate skills unit
//-------------------------------------------------------------------------------

//evaluate other user skill by id
test("evaluate a skill", async () => {
  const response = await request(app)
    .post(`/skills/${skillId.toString()}/rate`)
    .send({ rate: 5 })
    .expect(200);
});

//evaluate your skill failure
test("evaluate a skill", async () => {
  const response = await request(app)
    .post(`/skills/${skillId}/rate`)
    .send({ rate: 5 })
    .expect(403);
});

//search skill unit
//-------------------------------------------------------------------------------

//Get skills by name sorted
test("get skill", async () => {
  const response = request(app)
    .get("/skills/skill")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  //Visualisation ...    checked
});

//Testing the signup unit
//----------------------------------------------------------
test("Signup a new user", async () => {
  const usertest = {
    userName: "Test UserName",
    email: "test@gmail.com",
    password: "testHashed",
  };
  const response = await request(app).post("/auth").send(usertest).expect(201);

  //Assert that the database was updated
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  //Assertion about the response
  expect(response.body).toMatchObject({
    user: {
      userName: "Test UserName",
      email: "test@gmail.com",
    },
    token: user.tokens[0].token,
  });
  expect(user.password).not.toBe("AnisBoudiaf");
});

//testing the login unit
//----------------------------------------------------------

//Login

test("login a user", async () => {
  const response = await request(app)
    .post("/auth/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(response.body.user._id);

  //Assert that the token generated matches the second token
  //stored in the user tokens arr
  expect(user.tokens[1].token).toBe(response.body.token);
});

//Login fails
test("login failure", async () => {
  await request(app)
    .post("/auth/login")
    .send({
      email: "failed@gmail.com",
      password: "randomizeOOO",
    })
    .expect(400);
});

//testing the logout unit
//----------------------------------------------------------

test("simple logout", async () => {
  const response = await request(app)
    .post("/auth/logout")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById({ _id: response.body._id });
  //assertion that the database is updated
  expect(user.tokens.length).toEqual(0);
});

test("logout all", async () => {
  const response = await request(app)
    .post("/auth/logoutAll")
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200);

  //assertion that the database is updated
  const user = await User.findById({ _id: response.body._id });
  expect(user.tokens.length).toEqual(0);
});

//testing the getUser unit
//----------------------------------------------------------

//get authenticated user                ...Your profile
test("get authenticated user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

//authentication failure
test('shouldn"t get unauthenticated user', async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer notoken`)
    .send()
    .expect(401);
});

//Get other user profile

test("get other user profile", async () => {
  const response = await request(app)
    .get(`/users/${userTwoId}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  //assertion that we get the right user
  expect(response.body.email).toBe(userTwo.email); //The email is unique valide test
});

//Get other user profile failure
test("get other user profile failure", async () => {
  const response = await request(app)
    .get(`/users/invalidId`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(500);
});

//testing the delete unit
//----------------------------------------------------------
test("delete authenticated user", async () => {
  const response = await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  //Assertion about database update
  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("unable to delete unauthenticated user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bea`)
    .send()
    .expect(401);
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
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
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
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
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
  //Assert the update on the database
  //const user = await User.findById(userOneId)
  //verification
});

test("update background picture", async () => {
  const response = await request(app)
    .patch("/users/me/backgroundPicture")
    .attach("backgroundPicture", "tests/fixtures/test-pic.jpg")
    .expect(200);
  //Assert the update on the database
  //const user = await User.findById(userOneId)
  //verification
});

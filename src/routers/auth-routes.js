const router = require("express").Router();
const passport = require("passport");
const auth = require("../middlware/auth");
const User = require("../models/user");
const { join } = require("path");
const sharp = require("sharp");
router.get("/auth", async (req, res) => {});

//Basiclly SignUp
router.post("/api/auth/signup", async (req, res) => {
  const user = new User(req.body);
  const profileDist = join(__dirname, "../helpers/default_avatar.jpg");
  const backgroundDist = join(__dirname, "../helpers/background.jpeg");

  // user.imgUrl = `https://saqsini.herokuapp.com/users/${user._id}/profilePicture`;
  // user.backgroundUrl = `https://saqsini.herokuapp.com/users/${user._id}/backgroundPicture`;

  //user.profilePict = await sharp(profileDist)
  //  .resize(250, 250)
  // .jpeg()
  //  .toBuffer();
  // user.backgroundPict = await sharp(backgroundDist).jpeg().toBuffer(); //Think about the right resize

  try {
    const token = await user.generateAuthToken();
    //Send Welcome Mail
    await user.save();
    //await history.save()
    //mail.sendWelcomeEmail(user)
    res.status(201).send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//Done ...

//Login
router.post("/api/auth/login", async (req, res) => {
  try {
    const user = await User.findBycredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    await user.save();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: "Unable to login" });
  }
});

//Logout
router.get("/api/auth/logout", auth, async (req, res) => {
  try {
    //check if the connection was established by third party service
    if (req.user.githubId || req.user.linkedinId) {
      const user = req.user;
      req.logout();
      res.redirect("/");
    } else {
      req.user.tokens = req.user.tokens.filter(
        (token) => token.token !== req.token
      );
      await req.user.save();
      res.redirect("/");
    }
    // We did not pop the last element because we may login with multiple devices
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.post("/api/auth/logoutAll", auth, async (req, res) => {
  try {
    if (req.user.githubId || req.user.linkedinId) {
      const user = req.user;
      req.logout();
      res.status(200).send(user);
    }

    //we don't need to know connection src
    req.user.tokens = [];
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

// auth with github
router.get(
  "/auth/github",
  passport.authenticate("github", {
    scope: ["profile", "'user:email"],
  })
);

// callback route for github to redirect to
router.get(
  "/auth/github/callback",
  passport.authenticate("github"),
  (req, res) => {
    console.log("authenticated and trying to redirect");
    res.redirect("/Profile");
  }
);

// auth with linkedin
router.get(
  "/auth/linkedin",
  passport.authenticate("linkedin", {
    scope: ["r_liteprofile"],
  })
);

// callback route for linkedin to redirect to
router.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin"),
  (req, res) => {
    console.log("authenticated and trying to redirect");
    res.redirect("/Profile");
    //simple use res.send(req.user)
  }
);

module.exports = router;

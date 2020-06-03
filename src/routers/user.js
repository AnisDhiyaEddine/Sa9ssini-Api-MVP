// Initialisation of npm modules
const { join } = require("path");
const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const History = require("../models/chat");
const mail = require("../emails/account");
const auth = require("../middlware/auth");
const sharp = require("sharp");

const uploadPhoto = require("../middlware/uploadPhoto");

//get your profile
router.get("/users/me", auth, async (req, res) => {
  res.send({ user: req.user });
});

//get other user profile
router.get("/users/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(
      { _id: req.params.id },
      {
        userName: 1,
        email: 1,
        password: 1,
        gender: 1,
        tokens: 1,
        createdAt: 1,
        updatedAt: 1,
        imgUrl: 1,
        backgroundUrl: 1,
      }
    );

    if (!user) {
      res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

//Delete your profile
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    //Send cancelation email
    //mail.sendCancelationEmail(req.user);
    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

//Update user
//Note : pictures are updated in diffrent routes
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["userName", "email", "password", "gender"];
  const allowed = updates.every((update) => allowedUpdates.includes(update));
  //allowed true if every update is included in the allowedUpdates arr
  if (!allowed) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

//Handling the profilePicture

router.post(
  "/users/me/profilePicture",
  auth,
  uploadPhoto.single("profilePicture"),
  async (req, res) => {
    req.user.profilePict = await sharp(req.file.buffer)
      .resize(250, 250)
      .jpeg()
      .toBuffer();

    //Image manipulations suivant les requets de designer
    //Barebone setup
    /*
     const image = await Jimp.read(req.file.buffer);
        image.resize(250,250)
        req.user.profilePict = await image.getBufferAsync(Jimp.MIME_PNG);
        await req.user.save()
    */
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
    next();
  }
);

//Update profilePicture
router.patch(
  "/users/me/profilePicture",
  auth,
  uploadPhoto.single("profilePicture"),
  async (req, res) => {
    req.user.profilePict = await sharp(req.file.buffer)
      .resize(250, 250)
      .jpeg()
      .toBuffer();
    //Image manipulations suivant les requets de designer
    //Barebone setup
    /*
     const image = await Jimp.read(req.file.buffer);
        image.resize(250,250)
        req.user.profilePict = await image.getBufferAsync(Jimp.MIME_PNG);
        await req.user.save()
    */
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
    next();
  }
);

//GET my own profile Picture
router.get("/users/me/profilePicture", auth, async (req, res) => {
  const { profilePict } = await User.findOne(
    { _id: req.user._id },
    { profilePict: 1 }
  );

  if (!profilePict) return res.status(404).send();

  res.set("Content-Type", "image/jpeg");
  res.send(profilePict);
});

//GET others profile Picture
router.get("/users/:id/profilePicture", auth, async (req, res) => {
  const { profilePict } = await User.findOne(
    { _id: req.params.id },
    { profilePict: 1 }
  );

  if (!profilePict) return res.status(404).send();

  res.set("Content-Type", "image/jpeg");
  res.send(profilePict);
});

//Handling the background picture

router.post(
  "/users/me/backgroundPicture",
  auth,
  uploadPhoto.single("backgroundPicture"),
  async (req, res) => {
    req.user.backgroundPict = await sharp(req.file.buffer).jpeg().toBuffer();

    //Image manipulations suivant les requets de designer
    //Barebone setup
    /*
     const image = await Jimp.read(req.file.buffer);
        image.resize(250,250)
        req.user.profilePict = await image.getBufferAsync(Jimp.MIME_PNG);
        await req.user.save()
    */

    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
    next();
  }
);

router.patch(
  "/users/me/backgroundPicture",
  auth,
  uploadPhoto.single("backgroundPicture"),
  async (req, res) => {
    req.user.backgroundPict = await sharp(req.file.buffer).jpeg().toBuffer();

    //Image manipulations suivant les requets de designer
    //Barebone setup
    /*
     const image = await Jimp.read(req.file.buffer);
        image.resize(250,250)
        req.user.profilePict = await image.getBufferAsync(Jimp.MIME_PNG);
        await req.user.save()
    */

    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
    next();
  }
);

//get my own backgound pic
router.get("/users/me/backgroundPicture", auth, async (req, res) => {
  const { backgroundPict } = await User.findOne(
    { _id: req.user._id },
    { backgroundPict: 1 }
  );

  if (!backgroundPict) return res.status(404).send();

  res.set("Content-Type", "image/jpeg");
  res.send(backgroundPict);
});

//get others backgound pic
router.get("/users/:id/backgroundPicture", auth, async (req, res) => {
  const { backgroundPict } = await User.findOne(
    { _id: req.params.id },
    { backgroundPict: 1 }
  );

  if (!backgroundPict) return res.status(404).send();

  res.set("Content-Type", "image/jpeg");
  res.send(backgroundPict);
});

module.exports = router;

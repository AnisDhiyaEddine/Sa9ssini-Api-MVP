const express = require("express");
const router = new express.Router();
const Question = require("../models/question");
const auth = require("../middlware/auth");

router.post("/questions", auth, async (req, res) => {
  const question = new Question({
    ...req.body,
    answers: [],
    tags: [],
    owner: {
      _id: req.user._id,
      userName: req.user.userName,
    },
  });

  try {
    await question.save();
    res.status(201).send(question);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

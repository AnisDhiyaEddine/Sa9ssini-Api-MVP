const express = require("express");
const router = new express.Router();
const Question = require("../models/question");
const auth = require("../middlware/auth");

router.post("/questions/me", auth, async (req, res) => {
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

//get all posted questions Own posted questions !
router.get("/questions/me", auth, async (req, res) => {
  try {
    const postedQuestions = await Question.find({ "owner._id": req.user._id });
    if (postedQuestions.length > 0) {
      res.send(postedQuestions);
    } else {
      res.status(404).send({ error: "404 No question posted" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

//get question by ID
router.get("/questions/:questionID", auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionID);
    if (question) {
      res.send(question);
    } else {
      res.status(404).send({ error: "Question not found" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

//update question
router.patch("/questions/me/:questionID", auth, async (req, res) => {
  const _id = req.params.questionID; //question id
  const updates = Object.keys(req.body);
  const allowedUpdates = ["detail"]; //question a discuter "Crédibilité"

  const allowed = updates.every((update) => allowedUpdates.includes(update));

  if (!allowed) {
    return res.status(400).send({ error: "Invalid Updates" });
  }

  try {
    const question = await Question.findOne({ _id, "owner._id": req.user._id });

    if (!question) {
      return res.status(404).send();
    }
    updates.forEach((update) => {
      question[update] = req.body[update];
    });
    await question.save();
    res.send(question);
  } catch (error) {
    res.send(error);
  }
});

//Add a question tag
router.patch("/questions/me/:questionID/addTag", auth, async (req, res) => {
  const _id = req.params.questionID; //question id
  let tag = req.body.tag;
  tag = tag.trim().toLowerCase();
  console.log(tag);
  try {
    const question = await Question.findOne({ _id, "owner._id": req.user._id });
    if (!question) {
      return res.status(404).send({ error: "Not found" });
    }
    let exist = question.tags.find((el) => el.tag === tag);
    console.log(exist);
    if (!exist) {
      question.tags.push({ tag, type: "question tag" });
      console.log(question.tags);
    }
    await question.save();
    res.send(question);
  } catch (error) {
    res.send(error);
  }
});

//Delete question
router.delete("/questions/me/:questionID", async (req, res) => {
  const _id = req.params.questionID; //question id
  try {
    const question = await Question.findOneAndRemove({
      _id,
      "owner._id": req.user._id,
    });
    if (!question) {
      res.status(404).send({ error: "not found" });
    }
    res.status(200).send(question);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

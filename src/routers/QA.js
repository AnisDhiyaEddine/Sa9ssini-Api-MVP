const express = require("express");
const router = new express.Router();
const Question = require("../models/question");
const Answer = require("../models/answer");
const auth = require("../middlware/auth");
const cache = require('../services/cache');
const clear = require('../middlware/clearCache')

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

//Add an answer
router.patch("/questions/:questionID/addAnswer", auth, async (req, res) => {
  let _id = req.params.questionID; //question id

  try {
    let question = await Question.findById(_id);
    if (!question) {
      res.status(404).send({ error: "not found" });
    }
    let answerObj = {
      ...req.body,
      "owner._id": req.user._id,
      question: _id,
      voters: [],
      tags: [],
      votes: 0,
    };
    let answer = await new Answer(answerObj);
    await answer.save();

    let obj = { answer: answer._id, votes: answer.votes };
    question.answers.push(obj);
    await question.save();
    res.status(201).send({ question, answer });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
  // Add the answers to a diffrent collection and keep track of them using the id
});

//get the best answer
router.get("/answers/:questionID/bestAnswer", auth, async (req, res) => {
  const _id = req.params.questionID; //question id
  try {
    let max = 0;
    let question = await Question.findById(_id);
    if (!question) {
      res.status(404).send({ error: "not found" });
    }
    let maxVotes = 0;
    //get the id of the answer with the max votes
    question.answers.forEach(async (el) => {
      let answer = await Answer.findById(el.answer);
      if (answer.votes > maxVotes) {
        maxVotes = answer.votes;
      }
    });

    question.answers.forEach(async (el) => {
      let answer = await Answer.findById(el.answer);
      if (answer.votes == maxVotes) {
        res.send(answer);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//get all answers of a specifique question
router.get("/answers/:questionID", auth, async (req, res) => {
  console.log("hello");
  const _id = req.params.questionID; //question id
  try {
    let question = await Question.findById(_id);
    if (!question) {
      res.status(404).send({ error: "no question found" });
    }
    let answers = await Answer.find({ question: _id });
    res.send(answers);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//Add an answer tag
router.patch("/answers/me/:answerID/addTag", auth, async (req, res) => {
  const _id = req.params.answerID; //answer id
  let tag = req.body.tag;
  tag = tag.trim().toLowerCase();
  try {
    const answer = await Answer.findOne({ _id, "owner._id": req.user._id });
    console.log(answer);
    if (!answer) {
      return res.status(404).send({ error: "Not found" });
    }
    let exist = answer.tags.find((el) => el.tag === tag);
    console.log(exist);
    if (!exist) {
      answer.tags.push({ tag, type: "answer tag" });
      console.log(answer.tags);
    }
    console.log(answer);
    await answer.save();
    res.send(answer);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

//vote an answer
router.patch("/answers/:answerID/vote", auth, async (req, res) => {
  const _id = req.params.answerID;
  try {
    const answer = await Answer.findOne({ _id });
    if (!answer) {
      return res.status(404).send();
    }
    if (req.user._id.equals(answer.owner._id)) {
      return res.status(403).send("invalid vote operation");
    }
    let exist = answer.voters.filter((el) => {
      return el.voter.equals(req.user._id);
    });

    if (!exist.length) {
      answer.voters.push({ voter: req.user._id });
    }

    answer.votes = answer.voters.length;

    await answer.save();
    await answer.populate("voters.voter").execPopulate();
    res.send(answer);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

module.exports = router;

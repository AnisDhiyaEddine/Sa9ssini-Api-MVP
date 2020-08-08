const express = require("express");
const router = new express.Router();
const Chat = require("../models/chat");
const Message = require("../models/message");
const auth = require("../middlware/auth");
const cache = require("../services/cache");
const clearCache = require("../middlware/clearCache");

router.post("/api/chats", auth, clearCache, async (req, res) => {
  const { user_01, user_02 } = req.body;
  const chat = new Chat({
    user_01,
    user_02,
  });
  try {
    const existed = await Chat.find({
      $and: [{ user_01 }, { user_02 }],
    }).cache({ key: req.user._id });
    console.log(existed);
    if (existed.length > 0) {
      res.send(existed[0]);
    } else {
      await chat.save();
      res.status(201).send(chat);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/api/chats", auth, async (req, res) => {
  try {
    const chats = await Chat.find({
      $or: [{ user_01: req.user._id }, { user_02: req.user._id }],
    }).cache({ key: req.user._id });

    res.send(chats).status(200);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post(
  "/api/chats/:chat_id/messages",
  auth,
  clearCache,
  async (req, res) => {
    const message = new Message({
      ...req.body,
      chat: req.params.chat_id,
    });
    try {
      await message.save();
      res.status(201).send(message);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.get("/api/chats/:chat_id/messages", auth, async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chat_id }).cache({
      key: req.user._id,
    });
    res.send(messages);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

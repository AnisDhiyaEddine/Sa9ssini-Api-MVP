const express = require("express");
const router = new express.Router();
const Chat = require("../models/chat");
const auth = require("../middlware/auth");

router.get("/chat", auth, async (req, res) => {
  res.redirect("http://localhost:8080");
});

module.exports = router;

mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    user_01: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    user_02: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timeStamps: true,
  }
);

const ChatSchema = mongoose.model("Chat", chatSchema);

module.exports = ChatSchema;

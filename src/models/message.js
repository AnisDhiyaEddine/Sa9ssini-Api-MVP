mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    to_user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    from_user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Chat",
    },
  },
  {
    timestamps: true,
  }
);

const MessageSchema = mongoose.model("Message", messageSchema);

module.exports = MessageSchema;

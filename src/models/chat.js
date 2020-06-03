mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    messages: [
      {
        message: {
          type: String,
          trim: true,
          required: true,
        },
        status: {
          type: String,
          validate(status) {
            if (status !== "sent" && status !== "recieved") {
              throw new Error("Invalid message status");
            }
          },
        },
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        reciever: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
      },
    ],
  },
  {
    timeStamps: true,
  }
);

const ChatSchema = mongoose.model("Chat", chatSchema);

module.exports = ChatSchema;

// One to one chat
/*
const document = {
  user: ObjectId("user object id"),
  messages: [
    {
      message: "hello dear",
      status: "sent",
      owner: "user id",
      reciever: "reciever id",
      creeatedAt: "timeStamp",
    },
    {
      message: "hello Anis",
      status: "recieved",
      reciever: "user id",
      owner: "sender id",
      creeatedAt: "timeStamp",
    },
  ],
};
*/
//While downloading chat history ..   .
/*
1- get the document of the authenticated user
2- set the history of the active chat 
 */

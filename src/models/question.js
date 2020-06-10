const mongoose = require("mongoose");
const validator = require("validator");

const questionSchema = new mongoose.Schema(
  {
    owner: {
      _id: mongoose.Types.ObjectId,
      userName: String,
    },
    question: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    answers: [
      {
        answer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Answer",
        },
        evaluation: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;

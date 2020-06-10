const mongoose = require("mongoose");
const validator = require("validator");

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      _id: {
        type: mongoose.Types.ObjectId,
      },
      userName: {
        type: String,
      },
    },
    raters: [
      {
        rater: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rate: { type: Number },
      },
    ],
    evaluation: {
      type: Number,
    },
    tags: [
      {
        tag: {
          type: String,
        },
        type: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Answer = mongoose.model("Answer", answerSchema);

module.exports = Answer;

mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      trim: true,
      required: true,
    },
    evaluation: {
      type: Number,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    owner: {
      _id: {
        type: mongoose.Types.ObjectId,
      },
      userName: {
        type: String,
      },
      imgUrl: {
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
  },
  {
    timestamps: true,
  }
);

const Skill = mongoose.model("Skill", skillSchema);

module.exports = Skill;

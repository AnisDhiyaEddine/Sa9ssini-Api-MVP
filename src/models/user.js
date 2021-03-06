const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Skill = require("../models/skill");
const keys = require("../../config/test");
const userSchema = new mongoose.Schema(
  {
    githubId: {
      type: String,
    },
    linkedinId: {
      type: String,
    },
    userName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      minlength: 6,
      trim: true,
    },
    imgUrl: String,
    backgroundUrl: String,
    gender: {
      type: String,
      trim: true,
      default: "not specific",
      validate(value) {
        if (!["Male", "Female", "not specific"].includes(value)) {
          throw new Error("Error gender");
        }
      },
    },
    university: { type: String, trim: true, default: "", lowercase: true },
    city: { type: String, trim: true, default: "", lowercase: true },
    phoneNbr: Number,
    availbleAt: { type: String, default: "" },
    about: { type: String, default: "" },
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
    profilePict: {
      type: Buffer,
    },
    backgroundPict: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

/*
//Setting up relations (Facultative
userSchema.virtual('skills',{
    ref:"Skill",
    localField:"_id",
    foreignField:"owner"
})
*/

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.pre("remove", function (next) {
  const user = this;
  Skill.deleteMany({ owner: user._id });
  next();
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, keys.jwtSecret);
  user.tokens.push({ token });
  return token;
};

//hide private data ...  monngoose the document to an object
// before it sends it back with res.send .
userSchema.methods.toJSON = function () {
  const user = this;

  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.profilePict;
  delete userObject.backgroundPict;

  return userObject;
};

userSchema.statics.findBycredentials = async (email, password) => {
  const user = await User.findOne(
    { email },
    {
      userName: 1,
      email: 1,
      password: 1,
      gender: 1,
      tokens: 1,
      createdAt: 1,
      updatedAt: 1,
    }
  );
  if (!user) {
    throw new Error("Unable to login");
  }
  const ismatch = await bcrypt.compare(password, user.password);
  if (!ismatch) {
    throw new Error("Unable to login");
  }

  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

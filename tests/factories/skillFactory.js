const mongoose = require("mongoose");
const skillId = new mongoose.Types.ObjectId();
const { userOne } = require("./userFactory");
const skill = {
  _id: skillId,
  skill: "Skill",
  description: "skill description",
  owner: {
    _id: userOne._id,
    userName: userOne.userName,
  },
  evaluation: 0,
  nbrEvaluations: 0,
};


module.exports = {skill , skillId}
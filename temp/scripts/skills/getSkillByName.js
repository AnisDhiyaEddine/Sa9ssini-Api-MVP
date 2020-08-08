const { get } = require("../config");

module.exports = async (skillName) => {
  const { data } = await get({
    url: `/skills/${skillName}`,
  });

  return data;
};

//THE response of getSkillByName
//array of skills
const response = [
  {
    owner: {
      _id: "5eaf0049e241b400179fcb9c",
      userName: "malibu",
      imgUrl: "/users/5eaf0049e241b400179fcb9c/profilePicture",
    },
    _id: "5eb045309a16ea00176c9aa4",
    skill: "moraba",
    description: "JaaaNn had chir !!",
    createdAt: "2020-05-04T16:39:12.739Z",
    updatedAt: "2020-05-04T16:39:12.739Z",
  },
  {
    owner: {
      _id: "5eaf0049e241b400179fcb9c",
      userName: "malibu",
      imgUrl: "/users/5eaf0049e241b400179fcb9c/profilePicture",
    },
    _id: "5eb045309a16ea00176c9aa4",
    skill: "moraba",
    description: "JaaaNn had chir !!",
    createdAt: "2020-05-04T16:39:12.739Z",
    updatedAt: "2020-05-04T16:39:12.739Z",
  },
];

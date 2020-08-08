const { get } = require("../config");

module.exports = async () => {
  const { data } = await get({
    url: `/skills/me`,
  });

  return data;
};

//THE response of geMySkills
//array of skills
const response = [
  {
    _id: "5eb045309a16ea00176c9aa4",
    skill: "moraba",
    description: "JaaaNn had chir !!",
    createdAt: "2020-05-04T16:39:12.739Z",
    updatedAt: "2020-05-04T16:39:12.739Z",
  },
  {
    _id: "5eb045309a16ea00176c9aa4",
    skill: "moraba",
    description: "JaaaNn had chir !!",
    createdAt: "2020-05-04T16:39:12.739Z",
    updatedAt: "2020-05-04T16:39:12.739Z",
  },
];

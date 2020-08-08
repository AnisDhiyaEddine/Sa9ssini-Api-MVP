const { get } = require("../config");

module.exports = async (userName) => {
  try {
    const { data } = await get({
      url: `/users/get/${userName}`,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

//Response form

const response = {
  gender: "male",
  _id: "5eb02f4b7fb70f001786414f",
  userName: "lomi",
  email: "k.mario@mail.com",
  imgUrl:
    "https://saqsini-api.herokuapp.com/users/5eb02f4b7fb70f001786414f/profilePicture",
  backgroundUrl:
    "https://saqsini-api.herokuapp.com/users/5eb02f4b7fb70f001786414f/backgroundPicture",
  createdAt: "2020-05-04T15:05:47.344Z",
  updatedAt: "2020-05-05T09:10:03.216Z",
};

const ResponseLinkedinAuth = {
  createdAt: "2020-06-01T11:25:24.020Z",
  gender: "not specific",
  imgUrl: "urn:li:digitalmediaAsset:C5603AQGCjpxlw79pyQ",
  linkedinId: "6_14g8bKD1",
  updatedAt: "2020-06-01T11:25:24.020Z",
  userName: "Boudiaf Anis DHIYA EDDINE",
  __v: 0,
  _id: "5ed4e5a4d1202b2c033e22df",
};

const responseGithubAuth = {
  _id: "5ed3e108db9a599d64b89df5",
  gender: "not specific",
  userName: "AnisDhiyaEddine",
  githubId: "45804461",
  tokens: [],
  createdAt: "2020-05-31T16:53:28.508Z",
  updatedAt: "2020-05-31T16:53:28.508Z",
  __v: 0,
};

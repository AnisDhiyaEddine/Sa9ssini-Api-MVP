const { post } = require("../config");

module.exports = async () => {
  try {
    const { data } = await post({
      url: `/auth/logout`,
    });

    localStorage.removeItem("Auth");
    console.log(data)
    return data;
  } catch (e) {
    console.log(e);
  }
};

//the RESPONSE OF logout
const response = {
  gender: "not specific",
  _id: "5eb12a9bf49655211b63c4d2",
  userName: "lomi",
  email: "s.mario@mail.com",
  imgUrl:
    "https://saqsini-api.herokuapp.com/users/5eb12a9bf49655211b63c4d2/profilePicture",
  backgroundUrl:
    "https://saqsini-api.herokuapp.com/users/5eb12a9bf49655211b63c4d2/backgroundPicture",
  createdAt: "2020-05-05T08:58:03.747Z",
  updatedAt: "2020-05-05T08:58:03.747Z",
  __v: 0,
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
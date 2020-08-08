const { post } = require("../config");

module.exports = async (email,password) => {
  try {
    const { data } = await post({
      url: "/auth/login",
      data: {
        email,
        password,
      },
    });

    localStorage.setItem("Auth", `Bearer ${data.token}`);
    return data;
  } catch (e) {
    console.log(e); 
  }
};


//the RESPONSE OF login
const response = {
    user: {
        gender: "not specific",
        _id: "5eb12a9bf49655211b63c4d2",
        userName: "lomi",
        email: "s.mario@mail.com",
        imgUrl: "https://saqsini-api.herokuapp.com/users/5eb12a9bf49655211b63c4d2/profilePicture",
        backgroundUrl: "https://saqsini-api.herokuapp.com/users/5eb12a9bf49655211b63c4d2/backgroundPicture",
        createdAt: "2020-05-05T08:58:03.747Z",
        updatedAt: "2020-05-05T08:58:03.747Z",
        __v: 0
    },
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWIxMmE5YmY0OTY1NTIxMWI2M2M0ZDIiLCJpYXQiOjE1ODg2NjkwODN9.nxx1sEO2yw52txvn4PlaC3qP27NkhC1tya6XqwQYDmY"
}
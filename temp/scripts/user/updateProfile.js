const { patch } = require('../config')

module.exports = async (updates = {}) => {
    const { data } = await patch({
        url: `/users/me`,
        data: updates
    })

    return data;
}

//Updates is an Objest that contains one or more
//of the following properties
// {userName, email, password, gender}
//exemple:
//const updates = {userName: 'imane', gender: 'female'}
//updateProfile()


//THE RESPONSE OF updateProfile
//
const response = {
    gender: "not specific",
    _id: "5eb12a9bf49655211b63c4d2",
    userName: "lomi",
    email: "s.mario@mail.com",
    imgUrl: "https://saqsini-api.herokuapp.com/users/5eb12a9bf49655211b63c4d2/profilePicture",
    backgroundUrl: "https://saqsini-api.herokuapp.com/users/5eb12a9bf49655211b63c4d2/backgroundPicture",
    createdAt: "2020-05-05T08:58:03.747Z",
    updatedAt: "2020-05-05T08:58:03.747Z",
    __v: 0
} 
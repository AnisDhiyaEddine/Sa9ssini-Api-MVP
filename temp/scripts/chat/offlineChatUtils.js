const { getSocketServer, get, post } = require("../config");

import "regenerator-runtime/runtime";

const getActiveUsers = async () => {
  try {
    const { data } = await getSocketServer({
      url: "/active",
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getChats = async () => {
  try {
    const { data } = await get({
      url: "/chats",
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getMessages = async (chat_id, user_id) => {
  //you will always recive chat you're included in
  //user_id just to specify if you're the one who sent or recieved
  //invalid user_id .. signifies that he sent the messsage
  try {
    const { data } = await get({
      url: `/chats/${chat_id}/messages`,
    });
    if (data.length > 0) {
      data.forEach((message) => {
        if (message.to_user == user_id) {
          message.status = "recieved";
        }
      });
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

const startChat = async (user_01, user_02) => {
  try {
    const { data } = await post({
      url: "/chats",
      data: {
        user_01,
        user_02,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

const handleChat = async (from_user, to_user) => {
  const chats = await getChats();
  let chat;
  if (chats.length > 0) {
    let started = false;
    chats.forEach((el) => {
      if (
        (el.user_01 === from_user || el.user_01 === to_user) &&
        (el.user_02 === from_user || el.user_02 === to_user)
      ) {
        started = true;
        chat = el;
      }
    });
  }
  if (chat) {
    return chat;
  }
  chat = await startChat(from_user, to_user);
  return chat;
};

const sendMessage = async (message, from_user, to_user) => {

  const chat = await handleChat(from_user, to_user);
  const { data } = await post({
    url: `/chats/${chat._id}/messages`,
    data: {
      to_user,
      from_user,
      status: "sent",
      message,
    },
  });
  return { message: data, chat };
};



module.exports = {
  getActiveUsers,
  getChats,
  getMessages,
  sendMessage,
  startChat,
  handleChat,
};

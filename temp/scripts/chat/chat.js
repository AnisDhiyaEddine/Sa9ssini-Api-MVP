const io = require("socket.io-client");
const socket = io.connect("http://localhost:8080");
import "regenerator-runtime/runtime";
let ObjectId = require("mongoose").Types.ObjectId;
/*
ToDo : 
1- load user history of messages display instantly
2- user want to send a message to another user 
--> * require the userName of the sender .. easy part
    * get the userName of the reciever   .. provided by the user
    * check if the reciever is online
    * if yes : 
    * --> * get the shared chat-room .. 
          * interact save messages when sending them online and only when sending them
    * if no: 
    *  --> * start the chat room
           * display the message and save it to the database

        
//when you start a chat you start it having the targetID ..
*/

//View Unit
const UIController = () => {
  //Get DOM strings
  const DOMStrings = {
    freindList: document.querySelector(".friend-list"),
    chat: document.querySelector(".chat"),
    messageForm: document.querySelector("#message-form"),
    messageInput: document
      .querySelector("#message-form")
      .querySelector("input"),
    messageButton: document
      .querySelector("#message-form")
      .querySelector("#send-message"),
    locationButton: document
      .querySelector("#message-form")
      .querySelector("#send-location"),
    history: document.querySelector(".friend-list"),
  };

  const Templates = {
    messageSentTemplate: `<div class="message"><li class="right clearfix"><span class="chat-img pull-right"><img src="https://bootdey.com/img/Content/user_1.jpg" alt="User Avatar"></span><div class="chat-body clearfix"><div class="header"><small class="pull-right text-muted"><i class="fa fa-clock-o"></i> {{createdAt}}</small></div><p>{{message}}</p></div></li></div>`,
    locationSentTemplate: `<div class="message"><li class="right clearfix"><span class="chat-img pull-right"><img src="https://bootdey.com/img/Content/user_1.jpg" alt="User Avatar"></span><div class="chat-body clearfix"><div class="header"><small class="pull-right text-muted"><i class="fa fa-clock-o"></i> {{createdAt}}</small></div><p><a href={{url}}>Location</a></p></div></li></div>`,
    messageRecievedTemplate: `<div class="message"><li class="left clearfix"><span class="chat-img pull-left"><img src="https://bootdey.com/img/Content/user_3.jpg" alt="User Avatar"></span><div class="chat-body clearfix"><div class="header"><strong class="primary-font" class="message__name">{{username}}</strong><small class="pull-right text-muted"><i class="fa fa-clock-o" class="message__meta"></i> {{createdAt}}</small></div><p>{{text}}</p></div></li></div>`,
    locationRecievedTemplate: `<div class="message"><li class="left clearfix"><span class="chat-img pull-left"><img src="https://bootdey.com/img/Content/user_3.jpg" alt="User Avatar"></span><div class="chat-body clearfix"><div class="header"><strong class="primary-font" class="message__name">{{username}}</strong><small class="pull-right text-muted"><i class="fa fa-clock-o" class="message__meta"></i> {{createdAt}}</small></div><p><a href={{url}}>Location</a></p></div></li></div>`,
    historyTemplate: `<li class="active bounceInDown"><a href="#" class="clearfix"><imgsrc="https://bootdey.com/img/Content/user_1.jpg"alt=""class="img-circle"/><div class="friend-name"><strong>{{otherName}}</strong></div><div class="last-message text-muted">{{message}}</div><small class="time text-muted">{{at}}</small><small class="chat-alert label label-danger">{{status}}</small></a></li>`,
  };

  const getMsgInput = () => {
    return DOMStrings.messageInput.value;
  };

  const displayMsg = (html) => {
    DOMStrings.chat.insertAdjacentHTML("beforeend", html);
  };

  const disableBtn = () => {
    DOMStrings.messageButton.setAttribute("disabled", "disabled");
  };

  const formatBtn = () => {
    DOMStrings.messageButton.removeAttribute("disabled");
    DOMStrings.messageInput.value = "";
    DOMStrings.messageInput.focus();
  };

  const displayHistory = (html) => {
    DOMStrings.history.insertAdjacentHTML("beforeend", html);
  };

  //Get the name of the to_user
  const { to_user } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  const room = "default";
  //The idea behind it ..Ayoub pass the to_user in a query string
  return {
    DOMStrings,
    Templates,
    getMsgInput,
    displayMsg,
    disableBtn,
    formatBtn,
    displayHistory,
    to_user,
    room,
  };
};

const APPController = async () => {
  const UICtrl = UIController();
  const ModelCtrl = ModelController();

  //handling the discussion
  let {
    userName,
    room,
    chat,
    from_user,
    to_user,
    active,
  } = await ModelCtrl.handlingDiscussion(
    UICtrl.Templates.historyTemplate,
    UICtrl.to_user
  );
  console.log({
    userName,
    room,
    chat,
    from_user,
    to_user,
    active,
  });
  //when the user is not active .. 2 solutions .. 1- emit the event to a unique room no one is connected to
  //.. 2- use if else statements ..
  //we will go with the first solution we just store messages ..!
  //listen for incoming messages
  ModelCtrl.listenIncMsg(UICtrl.Templates.messageRecievedTemplate);

  //listen for incoming location share
  ModelCtrl.listenLocation(UICtrl.Templates.locationRecievedTemplate);

  UICtrl.DOMStrings.messageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
      await ModelCtrl.sendMsg(
        from_user._id,
        to_user._id,
        UICtrl.getMsgInput(),
        UICtrl.Templates.messageSentTemplate
      );
    
  });

  //share location
  UICtrl.DOMStrings.locationButton.addEventListener("click", (e) => {
    e.preventDefault();
    ModelCtrl.shareLocation(UICtrl.Templates.locationSentTemplate);
  });

  //Join a chat room
  ModelCtrl.join({ username: userName, room });
};

const ModelController = () => {
  //Basic usage of UICtrl
  const UICtrl = UIController();
  //////////////////////////////////////////////////////////////////////////////

  const {
    getActiveUsers,
    getChats,
    getMessages,
    sendMessage,
    startChat,
    handleChat,
  } = require("./offlineChatUtils");

  const getOwnProfile = require("../user/getOwnProfile");
  const getOtherProfile = require("../user/getOtherProfile");
  const getOtherProfileByName = require("../user/getOtherProfileByName");

  const getOther = async (chat, userName) => {
    const user_01 = await getOtherProfile(chat.user_01);
    const user_02 = await getOtherProfile(chat.user_02);
    return userName == user_01.userName ? user_02 : user_01;
  };
  //////////////////////////////////////////////////////////////////////////////

  const join = async ({ username, room }) => {
    socket.emit("join", { username, room }, (error) => {
      if (error) {
        alert(error);
        location.href = "/";
      }
    });
  };

  const listenIncMsg = (template) => {
    socket.on("message", (input) => {
      if (input) {
        const html = Mustache.render(template, {
          username: input.username,
          text: input.text,
          createdAt: moment(input.createdAt).format("h:mm a"),
        });
        UICtrl.displayMsg(html);
      }
    });
  };

  const listenLocation = (template) => {
    socket.on("locationMessage", (message) => {
      const html = Mustache.render(template, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format("h:mm a"),
      });
      UICtrl.displayMsg(html);
    });
  };

  const sendMsg = async (from_user, to_user, input, template) => {
    await sendMessage(input, from_user, to_user);
    socket.emit("sendMessage", input, () => {
      const html = Mustache.render(template, {
        message: input,
        createdAt: moment(input.createdAt).format("h:mm a"),
      });
      UICtrl.disableBtn();
      UICtrl.displayMsg(html);
      UICtrl.formatBtn();
    });
  };

  // i won't save user location in the database .. ce n'est pas pratique!
  const shareLocation = (template) => {
    if (!navigator.geolocation) {
      return alert("Geolocation is not supported by your browser.");
    }
    navigator.geolocation.getCurrentPosition((position) => {
      socket.emit(
        "sendLocation",
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        () => {
          const html = Mustache.render(template, {
            url: `https://google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`,
            createdAt: moment(new Date().getTime()).format("h:mm a"),
          });
          UICtrl.displayMsg(html);
        }
      );
    });
  };

  const getActivity = async (to_user) => {
    try {
      const toUser = await getOtherProfileByName(to_user);
      let { users } = await getActiveUsers();
      if (users) {
        let active = users.find((user) => user.username == toUser.userName);
        if (active) {
          return { active: true, user: toUser };
        }
      }
      console.log(toUser);
      return { active: false, user: toUser };
    } catch (error) {
      console.log(error);
    }
  };

  const loadHistory = async (template) => {
    try {
      const chats = await getChats();
      let { user, userName } = await getOwnProfile();
      let html;
      if (user) {
        chats.forEach(async (chat) => {
          let other = await getOther(chat, userName);
          let messages = await getMessages(chat._id, user._id);
          let lastMessage = messages[messages.length - 1];
          html = Mustache.render(template, {
            message: lastMessage.message,
            status: lastMessage.status,
            otherName: other.userName,
            at: moment(lastMessage.createdAt).format("h:mm a"),
          });
          UICtrl.displayHistory(html);
        });
        return { user, userName };
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };

  const handlingDiscussion = async (template, to_userName) => {
    try {
      let loadRes = await loadHistory(template);
      let userName = loadRes.userName;
      let from_user = loadRes.user;

      let statusRes = await getActivity(to_userName);
      let active, to_user;
      if (statusRes) {
        active = statusRes.active;
        to_user = statusRes.user;
      }
      let room, chat;
      if (active) {
        chat = await handleChat(from_user._id, to_user._id);
        room = chat._id;
      }
      if (!room) {
        room = from_user._id;
      }
      return {
        userName,
        room,
        chat,
        from_user,
        to_user,
        active,
      };
    } catch (error) {
      console.log(error);
    }
  };

  return {
    listenIncMsg,
    sendMsg,
    shareLocation,
    listenLocation,
    join,
    handlingDiscussion,
  };
};

APPController();

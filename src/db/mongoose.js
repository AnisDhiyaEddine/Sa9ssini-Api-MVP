const mongoose = require("mongoose");
const keys = require("../../config/keys");
mongoose.connect(
  keys.mongoURI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Database connected successfully");
  }
);

//
//mongod --dbpath /home/anis/Desktop/mongoDev/data/db  init server command     --> automated start .Boss

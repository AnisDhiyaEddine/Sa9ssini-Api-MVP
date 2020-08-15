const mongoose = require("mongoose");
jest.setTimeout(30000);

require("../models/User");

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URL, { useMongoClient: true });

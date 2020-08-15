const app = require("./app");
const keys = require("../config/keys");
const port = keys.port;
app.listen(port, () => {
  console.log("Server is up on port " + port);
});

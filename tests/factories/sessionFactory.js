const Buffer = require("safe-buffer").Buffer;
const Keygrip = require("keygrip");
const configKeys = require("../../config/keys");
module.exports = async (id) => {
  const sessionObj = {
    passport: {
      user: id,
    },
  };
  const session = Buffer.from(JSON.stringify(sessionObj)).toString("base64");
  const keys = [configKeys.cookieKey];
  const keygrip = new Keygrip(keys);
  const sig = keygrip.sign("session=" + session);
  return { session, sig };
};

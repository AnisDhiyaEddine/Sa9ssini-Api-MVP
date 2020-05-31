const Buffer = require("safe-buffer").Buffer;
const Keygrip = require("keygrip");
//tempo 



module.exports = async (id)=>{
    const sessionObj = {
        passport: {
          user: id,
        },
      };
      const sessionStr = Buffer.from(JSON.stringify(sessionObj)).toString("base64");
      const keys = [process.env.cookieSessionKey];
      const keygrip = new Keygrip(keys);
      const sig = keygrip.sign("session=" + sessionStr);
return {sessionStr,sig}      
} 
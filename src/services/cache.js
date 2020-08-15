const mongoose = require("mongoose");
/* const redis = require("redis");
const util = require("util");
const redisUrl = "redis://127.0.0.1:6379"; */
/* const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);
client.del = util.promisify(client.del); */
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
  this.Primarykey = JSON.stringify(options.key || "default");
  this.iscache = true;
  return this;
  //mark a flag and chaine it
};

mongoose.Query.prototype.exec = async function () {
  if (!this.iscache) {
    return exec.apply(this, arguments);
  } else {
    const key = JSON.stringify(
      Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name,
      })
    );
    // check if the data is on redis server
    // const cachedValue = await client.hget(this.Primarykey, key);
    // if yes :
    /*  if (cachedValue) {
      //we have to return a mongooseDocument
      //two gotchas
      //1- we convert the cached value ..partial solution
      //2- trying to hydrate if the gotten response is an array
      let doc = JSON.parse(cachedValue);
      Array.isArray(doc)
        ? doc.map((d) => new this.model(d))
        : new this.model(doc);
      return doc;
    }
 */
    // otherwise :
    const result = await exec.apply(this, arguments);
    // client.hset(this.Primarykey, key, JSON.stringify(result), "EX", 900); //cache data for 15min and clear it automatically
    // result is a mongoose document
    return result;
  }
};

const clearCache = function (key) {
  // client.del(JSON.stringify(key));
};

module.exports = {
  clearCache,
};

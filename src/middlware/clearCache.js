const { clearCache } = require("../services/cache");

module.exports = async (req, res, next) => {
  await next();
  await clearCache(req.user._id);
};


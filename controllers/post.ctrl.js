const model = require("../models");

exports.post_post = async (req, res, next) => {
  const { title, description, price, dealine, requiredTime } = req.body;
  try {
  } catch (e) {
    return next(e);
  }
};

const model = require("../models");
const Sequelize = require("sequelize");

exports.get_main = async (req, res, next) => {
  const Op = Sequelize.Op;
  try {
    const userAddress = await model.UserAddress.findOne({ where: { userId: req.user.id }, attributes: ["neighborhoods"] });
    const neighborhoods = userAddress.neighborhoods.split(",");
    const data = await model.Post.findAll({ where: { sellingDistrict: { [Op.in]: neighborhoods } } });
    return res.status(200).json({ success: true, message: "홈 페이지에 들어갈 심부름들입니다.", data });
  } catch (e) {
    return next(e);
  }
};
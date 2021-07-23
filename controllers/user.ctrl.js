const model = require("../models");

exports.get_user = async (req, res, next) => {
  try {
    const user = await model.User.findOne({ where: { id: req.user.id } });
    const userAdderss = await model.UserAddress.findOne({ include: [{ model: model.District }] }, { where: { id: req.user.id } });
    const mypage = {
      nickname: user.nickname,
      mannerPoint: user.mannerPoint,
      cash: user.cash,
      simpleAddress: userAdderss.District.simpleAddress,
    };
    return res.status(200).json({ success: true, message: "마이페이지 유저정보를 불러옵니다.", mypage });
  } catch (e) {
    return next(e);
  }
};

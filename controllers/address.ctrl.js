const model = require("../models");

exports.get_address = async (req, res, next) => {
  try {
    const userAddress = await model.UserAddress.findOne({ where: { userId: req.user.id } });
    const addressScope = userAddress.addressScope;
    const district = await model.District.findOne({ where: { id: userAddress.districtId } });
    const simpleAddress = district.simpleAddress;
    res.status(200).json({ success: true, message: "회원의 기준지역과 활동범위를 반환합니다.", simpleAddress, addressScope });
  } catch (e) {
    return next(e);
  }
};

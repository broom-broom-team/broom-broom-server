const model = require("../models");

exports.get_admin_cog = async (req, res, next) => {
  const page = Number(req.query.page) ? Number(req.query.page) : 1;
  const contentSize = 20;
  const offset = (page - 1) * contentSize;
  const filter = Number(req.query.filter) ? false : true;
  try {
    const cog = await model.AdminCog.findAll({
      offset,
      limit: contentSize,
      paranoid: filter,
    });
    return res.status(200).json({ success: true, message: "충전/환급 요청내역들을 불러옵니다.", cog });
  } catch (e) {
    return next(e);
  }
};

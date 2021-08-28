const model = require("../models");
const Sequelize = require("sequelize");

exports.get_main = async (req, res, next) => {
  const Op = Sequelize.Op;
  try {
    const userAddress = await model.UserAddress.findOne({ where: { userId: req.user.id }, attributes: ["neighborhoods"] });
    const neighborhoods = userAddress.neighborhoods.split(",");
    const posts = await model.Post.findAll({
      where: { sellingDistrict: { [Op.in]: neighborhoods } },
      attributes: ["id", "title", "status", "price", "requiredTime", "deadline", "createdAt"],
      include: [
        { model: model.District, attributes: ["simpleAddress"] },
        { model: model.PostImage, attributes: ["postImageURI"] },
      ],
    });
    const data = [];
    for (let i = 0; i < posts.length; i++) {
      let postImageURI = posts[i].PostImages[0].postImageURI.split(",");
      let post = {
        id: posts[i].id,
        title: posts[i].title,
        deadline: posts[i].deadline,
        requiredTime: posts[i].requiredTime,
        updatedAt: posts[i].updatedAt,
        createdAt: posts[i].createdAt,
        price: posts[i].price,
        status: posts[i].status,
        simpleAddress: posts[i].District.simpleAddress,
        thumbnail: postImageURI[0],
      };
      data.push(post);
    }
    return res.status(200).json({ success: true, message: "홈 페이지에 들어갈 심부름들입니다.", data });
  } catch (e) {
    return next(e);
  }
};

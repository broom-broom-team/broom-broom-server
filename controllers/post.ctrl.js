const model = require("../models");
const postDefault = "https://broombroom.s3.ap-northeast-2.amazonaws.com/broomPost-default.png";

exports.post_post = async (req, res, next) => {
  const { title, description, price, deadline, requiredTime } = req.body;
  try {
    const images = req.files;
    const imagesURI = images.length != 0 ? images.map((img) => img.location) : postDefault;
    const postImageURI = imagesURI.toString();
    const userAddress = await model.UserAddress.findOne({ where: { userId: req.user.id } });
    if (userAddress) {
      await model.Post.create(
        {
          title,
          description,
          price,
          deadline,
          requiredTime,
          sellerId: req.user.id,
          sellingDistrict: userAddress.districtId,
          PostImages: [{ postImageURI }],
        },
        { include: [{ model: model.PostImage }] }
      );
      return res.status(200).json({ success: true, message: "심부름 등록이 완료되었습니다." });
    } else {
      return res.status(400).json({ success: true, message: "회원님의 주소를 찾을 수 없는 에러가 발생하였습니다." });
    }
  } catch (e) {
    return next(e);
  }
};

exports.get_post = async (req, res, next) => {
  const postId = req.params.id;
  try {
    const post = await model.Post.findOne({
      include: [{ model: model.PostImage }, { model: model.District }, { model: model.User, include: [{ model: model.ProfileImage }], paranoid: false }],
      where: { id: postId },
    });
    const userAddress = await model.UserAddress.findOne({ include: [{ model: model.District }] }, { where: { userId: post.sellerId } });
    const sellCount = await model.Post.count({ where: { status: "end", sellerId: post.sellerId } });
    const buyCount = await model.Post.count({ where: { status: "end", buyerId: post.sellerId } });
    const postInfo = {
      title: post.title,
      description: post.description,
      status: post.status,
      price: post.price,
      requiredTime: post.requiredTime,
      deadline: post.deadline,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      sellingDistrict: post.District.simpleAddress,
      postImages: post.PostImages[0].postImageURI.split(","),
    };
    const sellerInfo = {
      nickname: post.User.nickname,
      mannerPoint: post.User.mannerPoint,
      createdAt: post.User.createdAt,
      profileImages: post.User.ProfileImages[0].profileImageURI,
      simpleAddress: userAddress.District.simpleAddress,
      sellCount,
      buyCount,
    };
    if (post.User.deletedAt) {
      return res.status(200).json({ success: true, message: "심부름 상세보기", postInfo, sellerInfo: undefined });
    } else {
      return res.status(200).json({ success: true, message: "심부름 상세보기", postInfo, sellerInfo });
    }
  } catch (e) {
    return next(e);
  }
};

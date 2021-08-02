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
      return res.status(400).json({ success: false, message: "회원님의 주소를 찾을 수 없는 에러가 발생하였습니다." });
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
      paranoid: false,
    });
    if (post.deletedAt) {
      return res.status(400).json({ success: false, message: "삭제된 심부름입니다." });
    }
    const userAddress = await model.UserAddress.findOne({ include: [{ model: model.District }] }, { where: { userId: post.sellerId } });
    const sellCount = await model.Post.count({ where: { status: "end", sellerId: post.sellerId } });
    const buyCount = await model.Post.count({ where: { status: "end", buyerId: post.sellerId } });
    const postInfo = {
      id: post.id,
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
      return res.status(200).json({ success: true, message: "심부름 상세보기", postInfo, sellerInfo: "탈퇴한 회원" });
    } else {
      return res.status(200).json({ success: true, message: "심부름 상세보기", postInfo, sellerInfo });
    }
  } catch (e) {
    return next(e);
  }
};

exports.delete_post = async (req, res, next) => {
  const postId = req.params.id;
  try {
    const post = await model.Post.findOne({ where: { id: postId }, paranoid: false });
    if (post.deletedAt) {
      return res.status(400).json({ success: false, message: "이미 삭제된 게시글 입니다." });
    }
    if (post.sellerId === req.user.id) {
      if (!post.buyerId) {
        await model.Post.destroy({ where: { id: postId } });
        return res.status(200).json({ success: true, message: "삭제가 완료되었습니다." });
      } else {
        return res.status(400).json({ success: false, message: "약속이 확정된 이후에는 삭제할 수 없습니다." });
      }
    } else {
      return res.status(400).json({ success: false, message: "해당 심부름 작성자가 아닙니다." });
    }
  } catch (e) {
    return next(e);
  }
};

exports.get_edit = async (req, res, next) => {
  const postId = req.params.id;
  try {
    const post = await model.Post.findOne({ where: { id: postId }, include: [{ model: model.PostImage }] });
    const editpage = {
      id: post.id,
      title: post.title,
      description: post.description,
      price: post.price,
      requiredTime: post.requiredTime,
      deadline: post.deadline,
      postImages: post.PostImages[0].postImageURI != postDefault ? post.PostImages[0].postImageURI.split(",") : "현재 등록된 게시글 사진이 없습니다.",
    };
    if (post.sellerId === req.user.id) {
      if (post.status === "basic") {
        return res.status(200).json({ success: true, message: "심부름 수정을 위한 심부름 정보를 불러옵니다.", editpage });
      } else {
        return res.status(400).json({ success: false, message: "심부름이 마감되었거나 약속확정 이후에는 수정할 수 없습니다." });
      }
    } else {
      return res.status(400).json({ success: false, message: "해당 심부름 작성자가 아닙니다." });
    }
  } catch (e) {
    return next(e);
  }
};

exports.post_edit = async (req, res, next) => {
  const postId = req.params.id;
  const { title, description, price, deadline, requiredTime } = req.body;
  try {
    // TODO: 기존에 있던 사진 지울지 말지 결정하기
    const images = req.files;
    const imagesURI = images.length != 0 ? images.map((img) => img.location) : postDefault;
    const postImageURI = imagesURI.toString();
    const userAddress = await model.UserAddress.findOne({ where: { userId: req.user.id } });
    if (userAddress) {
      await model.Post.update(
        {
          title,
          description,
          price,
          deadline,
          requiredTime,
          sellerId: req.user.id,
          sellingDistrict: userAddress.districtId,
        },
        { where: { id: postId } }
      );
      await model.PostImage.update({ postImageURI }, { where: { postId } });
      return res.status(200).json({ success: true, message: "심부름 수정이 완료되었습니다." });
    } else {
      return res.status(400).json({ success: false, message: "회원님의 주소를 찾을 수 없는 에러가 발생하였습니다." });
    }
  } catch (e) {
    return next(e);
  }
};

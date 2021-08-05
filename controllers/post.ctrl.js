const model = require("../models");
const Sequelize = require("sequelize");
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

exports.get_history_me = async (req, res, next) => {
  try {
    const posts = await model.Post.findAll({
      where: { sellerId: req.user.id },
      order: [["updatedAt", "DESC"]],
      attributes: ["id", "title", "deadline", "requiredTime", "updatedAt", "price", "status"],
      include: [
        { model: model.District, attributes: ["simpleAddress"] },
        { model: model.PostImage, attributes: ["postImageURI"] },
      ],
    });
    if (posts.length === 0) {
      return res.status(200).json({ success: true, message: "아직 작성한 심부름이 없습니다." });
    } else {
      const history = [];
      for (let i = 0; i < posts.length; i++) {
        let postImageURI = posts[i].PostImages[0].postImageURI.split(",");
        let post = {
          id: posts[i].id,
          title: posts[i].title,
          deadline: posts[i].deadline,
          requiredTime: posts[i].requiredTime,
          updatedAt: posts[i].updatedAt,
          price: posts[i].price,
          status: posts[i].status,
          simpleAddress: posts[i].District.simpleAddress,
          thumbnail: postImageURI[0],
        };
        history.push(post);
      }
      return res.status(200).json({ success: true, message: "내가 작성한 심부름을 불러옵니다.", history });
    }
  } catch (e) {
    return next(e);
  }
};

exports.get_history_all = async (req, res, next) => {
  const Op = Sequelize.Op;
  try {
    // await model.Review.create({ point: 3, registerId: 3, postId: 5 });
    const sellerPosts = await model.Post.findAll({
      where: { sellerId: req.user.id, [Op.or]: [{ status: "proceed" }, { status: "end" }] },
      order: [["updatedAt", "DESC"]],
      attributes: ["id", "title", "deadline", "requiredTime", "updatedAt", "price", "status"],
      include: [
        { model: model.District, attributes: ["simpleAddress"] },
        { model: model.PostImage, attributes: ["postImageURI"] },
        { model: model.Review, attributes: ["point"] },
      ],
    });
    const buyerPosts = await model.Post.findAll({
      where: { buyerId: req.user.id },
      order: [["updatedAt", "DESC"]],
      attributes: ["id", "title", "deadline", "requiredTime", "updatedAt", "price", "status"],
      include: [
        { model: model.District, attributes: ["simpleAddress"] },
        { model: model.PostImage, attributes: ["postImageURI"] },
        { model: model.Review, attributes: ["point"] },
      ],
    });
    if (sellerPosts.length === 0 && buyerPosts.length === 0) {
      return res.status(200).json({ success: true, message: "아직 이용한 심부름이 없습니다." });
    } else {
      const buyerUsage = [];
      const sellerProceed = [];
      const sellerEnd = [];
      for (let i = 0; i < buyerPosts.length; i++) {
        let postImageURI = buyerPosts[i].PostImages[0].postImageURI.split(",");
        let post = {
          id: buyerPosts[i].id,
          title: buyerPosts[i].title,
          deadline: buyerPosts[i].deadline,
          requiredTime: buyerPosts[i].requiredTime,
          updatedAt: buyerPosts[i].updatedAt,
          price: buyerPosts[i].price,
          status: buyerPosts[i].status,
          simpleAddress: buyerPosts[i].District.simpleAddress,
          thumbnail: postImageURI[0],
          review: buyerPosts[i].Reviews[0] ? buyerPosts[i].Reviews[0].point : null,
        };
        buyerUsage.push(post);
      }
      for (let i = 0; i < sellerPosts.length; i++) {
        let postImageURI = sellerPosts[i].PostImages[0].postImageURI.split(",");
        let post = {
          id: sellerPosts[i].id,
          title: sellerPosts[i].title,
          deadline: sellerPosts[i].deadline,
          requiredTime: sellerPosts[i].requiredTime,
          updatedAt: sellerPosts[i].updatedAt,
          price: sellerPosts[i].price,
          status: sellerPosts[i].status,
          simpleAddress: sellerPosts[i].District.simpleAddress,
          thumbnail: postImageURI[0],
          buyerId: sellerPosts[i].buyerId, // 평점이 들어갈 구매자
        };
        if (post.status === "proceed") {
          sellerProceed.push(post);
        }
        if (post.status === "end") {
          (post.review = sellerPosts[i].Reviews[0] ? sellerPosts[i].Reviews[0].point : null), sellerEnd.push(post);
        }
      }
      return res.status(200).json({ success: true, message: "내가 이용한 심부름을 불러옵니다.", buyerUsage, sellerProceed, sellerEnd });
    }
  } catch (e) {
    return next(e);
  }
};

exports.post_review = async (req, res, next) => {
  const postId = req.params.id;
  const { reviewPoint } = req.body;
  try {
    const post = await model.Post.findOne({
      where: { id: postId },
      include: { model: model.Review, attributes: ["point"] },
    });
    if (post.Reviews[0]) {
      return res.status(400).json({ success: false, message: "이미 리뷰작성을 완료한 심부름입니다." });
    } else {
      if (post.sellerId === req.user.id && post.buyerId !== req.user.id) {
        if (post.status === "end") {
          await model.Review.create({ registerId: post.sellerId, postId: post.id, point: reviewPoint });
          return res.status(200).json({ success: true, message: "리뷰작성이 완료되었습니다." });
        } else {
          return res.status(400).json({ success: false, message: "아직 완료되지 않은 심부름입니다." });
        }
      } else {
        return res.status(400).json({ success: false, message: "리뷰작성 대상자가 아닙니다." });
      }
    }
  } catch (e) {
    return next(e);
  }
};

exports.get_search = async (req, res, next) => {};

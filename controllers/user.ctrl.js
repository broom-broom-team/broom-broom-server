const model = require("../models");
const bcrypt = require("bcrypt");

exports.get_user = async (req, res, next) => {
  try {
    const user = await model.User.findOne({ where: { id: req.user.id } });
    const userAdderss = await model.UserAddress.findOne({ include: [{ model: model.District }] }, { where: { userId: req.user.id } });
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

exports.get_edit = async (req, res, next) => {
  try {
    const user = await model.User.findByPk(req.user.id);
    const editpage = { nickname: user.nickname, name: user.name, phoneNumber: user.phoneNumber };
    return res.status(200).json({ success: true, message: "프로필 수정을 위한 기존 유저정보를 불러옵니다.", editpage });
  } catch (e) {
    return next(e);
  }
};

exports.post_edit = async (req, res, next) => {
  const { nickname, name, phoneNumber, password } = req.body;
  try {
    const user = await model.User.findByPk(req.user.id);
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (passwordCheck) {
      const exNickname = await model.User.findOne({ where: { nickname } });
      if (exNickname == null || exNickname.id == req.user.id) {
        await model.User.update({ nickname, name, phoneNumber }, { where: { id: req.user.id } });
        return res.status(200).json({ success: true, message: "프로필 수정이 완료되었습니다." });
      } else {
        return res.status(400).json({ success: false, message: "이미 존재하는 닉네임입니다." });
      }
    } else {
      return res.status(400).json({ success: false, message: "현재 비밀번호가 일치하지 않습니다." });
    }
  } catch (e) {
    return next(e);
  }
};

exports.put_edit_pwd = async (req, res, next) => {
  const { password, confirm_pwd, current_pwd } = req.body;
  try {
    const user = await model.User.findByPk(req.user.id);
    const passwordCheck = await bcrypt.compare(current_pwd, user.password);
    if (passwordCheck) {
      if (password == confirm_pwd) {
        const hash = await bcrypt.hash(password, await bcrypt.genSalt(12));
        await model.User.update({ password: hash }, { where: { id: req.user.id } });
        return res.status(200).json({ success: true, message: "비밀번호 수정이 완료되었습니다." });
      } else {
        return res.status(400).json({ success: false, message: "변경하려는 비밀번호가 틀렸습니다. 다시 입력해 주세요." });
      }
    } else {
      return res.status(400).json({ success: false, message: "현재 비밀번호가 일치하지 않습니다." });
    }
  } catch (e) {
    return next(e);
  }
};

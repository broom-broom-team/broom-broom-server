const model = require("../models");
const bcrypt = require("bcrypt");

exports.post_signup = async (req, res, next) => {
  const { email, nickname, password, confirm_pwd, phoneNumber } = req.body;
  try {
    const exUser = await model.User.findOne({ where: { email } });
    if (exUser) {
      return res.status(400).json({ success: false, message: "이미 존재하는 이메일입니다." });
    } else {
      const exNickname = await model.User.findOne({ where: { nickname } });
      if (exNickname) {
        return res.status(400).json({ success: false, message: "이미 존재하는 닉네임입니다." });
      } else {
        if (password == confirm_pwd) {
          const hash = await bcrypt.hash(password, await bcrypt.genSalt(12));
          await model.User.create({ email, nickname, password: hash, phoneNumber });
          return res.status(200).json({ success: true, message: "회원가입이 완료되었습니다." });
        } else {
          return res.status(400).json({ success: false, message: "비밀번호가 틀렸습니다. 다시 입력해 주세요." });
        }
      }
    }
  } catch (e) {
    return next(e);
  }
};

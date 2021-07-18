const model = require("../models");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");

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

exports.post_signin = async (req, res, next) => {
  passport.authenticate("local", { session: false }, (authError, user, info) => {
    if (authError) {
      return next(authError);
    }
    if (!user) {
      return res.status(400).json({ success: false, message: info.message });
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "5h" });
      return res.status(200).json({ success: true, message: "로그인에 성공하였습니다.", token });
    });
  })(req, res, next);
};

exports.post_send = async (req, res, next) => {
  const { email } = req.body;
  const { generateSecret, sendSecretMail } = require("../helpers/nodemailer");
  try {
    const exUser = await model.User.findOne({ where: { email } });
    if (exUser) {
      return res.status(400).json({ success: false, message: "이미 존재하는 이메일입니다." });
    } else {
      // TODO: 쿠키로 보관시 보안상문제있는지 물어보기 -> 어차피 암호화돼서 상관없으려나..?
      const secretKey = generateSecret();
      await sendSecretMail(email, secretKey);
      return res.cookie("secretKey", secretKey, { expiresIn: "30m" }).status(200).json({ success: true, message: "이메일 전송을 성공하였습니다.", secretKey });
    }
  } catch (e) {
    return next(e);
  }
};

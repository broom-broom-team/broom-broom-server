const nick_regex = /^[가-힣|a-z|A-Z|0-9|]{2,8}$/;
const name_regex = /^[가-힣]{2,8}$/;
const phone_regex = /^[0-9]{10,11}/;
const pwd_regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
const amount_regex = /^[0-9]{1,11}/;
const fs = require("fs");

exports.post_edit = (req, res, next) => {
  const { name, nickname, phoneNumber } = req.body;
  const file = req.file;
  if (!file) {
    if (!nick_regex.test(nickname)) {
      return res.status(400).json({ success: false, message: "닉네임은 특수문자 제외 2~8글자만 사용해야 합니다." });
    }
    if (!name_regex.test(name)) {
      return res.status(400).json({ success: false, message: "이름은 한글 2~8글자만 사용해야 합니다." });
    }
    if (!phone_regex.test(phoneNumber)) {
      return res.status(400).json({ success: false, message: "휴대폰번호는 숫자 10~11글자만 입력해야 합니다." });
    }
    next();
  } else {
    const filepath = file.path;
    if (!nick_regex.test(nickname)) {
      fs.unlinkSync(filepath);
      return res.status(400).json({ success: false, message: "닉네임은 특수문자 제외 2~8글자만 사용해야 합니다." });
    }
    if (!name_regex.test(name)) {
      fs.unlinkSync(filepath);
      return res.status(400).json({ success: false, message: "이름은 한글 2~8글자만 사용해야 합니다." });
    }
    if (!phone_regex.test(phoneNumber)) {
      fs.unlinkSync(filepath);
      return res.status(400).json({ success: false, message: "휴대폰번호는 숫자 10~11글자만 입력해야 합니다." });
    }
    next();
  }
};

exports.put_edit_pwd = (req, res, next) => {
  const { password } = req.body;
  if (!pwd_regex.test(password)) {
    return res.status(400).json({ success: false, message: "비밀번호는 숫자, 영문, 특수문자를 조합하여 8~16자리를 사용해야 합니다." });
  }
  next();
};

exports.post_point = (req, res, next) => {
  // 환급하려는 포인트는 1000원이상부터 가능하다.
  // type에 따라 필수로 입력해야하는 값이 있다. => 충전: chargeAmount, 환급: refundAmount, bankName, account
  const type = req.params.type;
  if (type == "refund") {
    const { refundAmount } = req.body;
    if (refundAmount) {
      if (amount_regex.test(refundAmount)) {
        next();
      } else {
        return res.status(400).json({ success: false, message: "충전하실 금액은 숫자만 입력가능합니다." });
      }
    } else {
      return res.status(400).json({ success: false, message: "충전하실 금액을 입력해주세요." });
    }
  } else {
    const { chargeAmount, bankName, account } = req.body;
    if (chargeAmount && bankName && account) {
      if (amount_regex.test(chargeAmount)) {
        next();
      } else {
        return res.status(400).json({ success: false, message: "충전하실 금액은 숫자만 입력가능합니다." });
      }
    } else {
      return res.status(400).json({ success: false, message: "환급받을 계좌의 정보를 모두 입력해주세요." });
    }
  }
};

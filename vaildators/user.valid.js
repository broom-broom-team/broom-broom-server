const nick_regex = /^[가-힣|a-z|A-Z|0-9|]{2,8}$/;
const name_regex = /^[가-힣]{2,8}$/;
const phone_regex = /^[0-9]{10,11}/;
const pwd_regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;

exports.post_edit = (req, res, next) => {
  const { name, nickname, phoneNumber } = req.body;
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
};

exports.put_edit_pwd = (req, res, next) => {
  const { password } = req.body;
  if (!pwd_regex.test(password)) {
    return res.status(400).json({ success: false, message: "비밀번호는 숫자, 영문, 특수문자를 조합하여 8~16자리를 사용해야 합니다." });
  }
  next();
};

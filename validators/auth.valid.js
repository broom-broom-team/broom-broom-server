// 유효성 검사관련 함수
const email_regex = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
const nick_regex = /^[가-힣|a-z|A-Z|0-9|]{2,8}$/;
const name_regex = /^[가-힣]{2,8}$/;
const pwd_regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
const phone_regex = /^[0-9]{10,11}/;
const secret_regex = /^[0-9]{6}/;

exports.post_signup = (req, res, next) => {
  const { name, nickname, password, phoneNumber } = req.body;
  if (name_regex.test(name)) {
    if (nick_regex.test(nickname)) {
      if (pwd_regex.test(password)) {
        if (phone_regex.test(phoneNumber)) {
          next();
        } else {
          return res.status(400).json({ success: false, message: "휴대폰번호는 숫자 10~11글자만 입력해야 합니다." });
        }
      } else {
        return res.status(400).json({ success: false, message: "비밀번호는 숫자, 영문, 특수문자를 조합하여 8~16자리를 사용해야 합니다." });
      }
    } else {
      return res.status(400).json({ success: false, message: "닉네임은 특수문자 제외 2~8글자만 사용해야 합니다." });
    }
  } else {
    return res.status(400).json({ success: false, message: "이름은 한글 2~8글자만 사용해야 합니다." });
  }
};

// TODO: 나중에 프론트 개발되면 post_signup에서 이메일 유효성검사는 지우기
exports.post_send = (req, res, next) => {
  const { email } = req.body;
  if (email_regex.test(email)) next();
  else return res.status(400).json({ success: false, message: "잘못된 형식의 이메일 주소입니다." });
};

exports.post_confirm = (req, res, next) => {
  const { secret } = req.body;
  if (secret_regex.test(secret)) next();
  else return res.status(400).json({ success: false, message: "인증번호는 숫자 6글자만 입력해야 합니다." });
};

exports.post_temp = (req, res, next) => {
  const { email, phoneNumber } = req.body;
  if (!email_regex.test(email)) {
    return res.status(400).json({ success: false, message: "잘못된 형식의 이메일 주소입니다." });
  }
  if (!phone_regex.test(phoneNumber)) {
    return res.status(400).json({ success: false, message: "휴대폰번호는 숫자 10~11글자만 입력해야 합니다." });
  }
  next();
};

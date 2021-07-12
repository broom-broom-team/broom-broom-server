// 유효성 검사관련 함수
const email_regex = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
const nick_regex = /^[가-힣|a-z|A-Z|0-9|]{2,8}$/;
const pwd_regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
const phone_regex = /^[0-9]{10,11}/;

exports.valid_signup = (req, res, next) => {
  const { email, nickname, password, phoneNumber } = req.body;
  if (email_regex.test(email)) {
    if (nick_regex.test(nickname)) {
      if (pwd_regex.test(password)) {
        if (phone_regex.test(phoneNumber)) {
          next();
        } else {
          return res.status(400).json({ success: false, message: "휴대폰번호는 숫자만 입력해야 합니다." });
        }
      } else {
        return res.status(400).json({ success: false, message: "비밀번호는 숫자, 영문, 특수문자를 조합하여 8~16자리를 사용해야 합니다." });
      }
    } else {
      return res.status(400).json({ success: false, message: "닉네임은 특수문자 제외 2~8글자만 사용해야 합니다." });
    }
  } else {
    return res.status(400).json({ success: false, message: "잘못된 형식의 이메일 주소입니다." });
  }
};

// 유효성 검사관련 함수
const name_regex = /^[ |가-힣|0-9|]{2,15}$/;

exports.post_check = (req, res, next) => {
  const { addressScope } = req.body;
  if (addressScope >= 0 && addressScope <= 5) {
    next();
  } else {
    return res.status(400).json({ success: false, message: "활동범위는 0~5까지의 숫자만 입력가능합니다." });
  }
};

exports.get_search = (req, res, next) => {
  let { name } = req.query;
  if (name != undefined) {
    name = name.trim();
    if (name_regex.test(name)) {
      next();
    } else {
      return res.status(400).json({ success: false, message: "주소검색은 영어, 특수문자 제외 2~10글자만 입력가능합니다." });
    }
  } else {
    next();
  }
};

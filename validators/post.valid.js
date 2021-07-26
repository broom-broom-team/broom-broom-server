const title_regex = /^.{4,40}$/;
const description_regex = /^.{8,400}$/;
const now = Date.now();

exports.post_post = (req, res, next) => {
  // TODO: requiredTime 유효성검사
  // TODO: 코드 좀 깔끔하게 수정할 것 (다른 파일의 코드들도 마찬가지)
  const { title, price, description, deadline } = req.body;
  const parseDeadline = new Date(deadline);
  if (!title_regex.test(title)) {
    return res.status(400).json({ success: false, message: "심부름 제목은 최소 4글자, 최대 40글자까지만 입력가능합니다." });
  }
  if (isNaN(parseDeadline.getTime())) {
    return res.status(400).json({ success: false, message: "마감시간은 숫자만 입력가능합니다." });
  } else {
    if (parseDeadline < now) {
      return res.status(400).json({ success: false, message: "마감시간은 현재시간보다 이후 시간만 입력가능합니다." });
    }
    if (parseDeadline.getFullYear() > 2099) {
      return res.status(400).json({ success: false, message: "마감시간의 년도는 2099년도 이전으로만 입력가능합니다." });
    }
  }
  if (!description_regex.test(description)) {
    return res.status(400).json({ success: false, message: "심부름 내용은 최소 8글자, 최대 400글자까지만 입력가능합니다." });
  }
  if (price < 1000) {
    return res.status(400).json({ success: false, message: "가격은 1000원이상부터 입력가능합니다." });
  }
  if (price % 10 != 0) {
    return res.status(400).json({ success: false, message: "가격의 최소단위는 10원입니다." });
  }
  next();
};

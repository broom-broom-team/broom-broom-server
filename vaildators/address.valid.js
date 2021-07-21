exports.post_check = (req, res, next) => {
  const { addressScope } = req.body;
  if (addressScope >= 0 && addressScope <= 5) {
    next();
  } else {
    return res.status(400).json({ success: false, message: "활동범위는 0~5까지의 숫자만 입력가능합니다." });
  }
};

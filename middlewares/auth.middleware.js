exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    // TODO: redirect("/login")으로 바꿀 예정 => 어차피 로그인 토큰은 무기한으로 줄 것 이라 로그아웃하지 않는 이상 로그인 유지되어 있을거임.
    // 로그아웃 버튼 클릭시 로그인 페이지로 이동
    return res.status(401).json({ success: false, message: "다시 로그인이 필요합니다." });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) next();
  } else {
    return res.status(401).json({ success: false, message: "접근 권한이 없습니다." });
  }
};

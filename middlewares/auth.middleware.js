exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    // redirect: 로그인페이지로
    return res.status(401).json({ success: false, message: "다시 로그인이 필요합니다." });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) next();
    else {
      // redirect: 현재페이지 새로고침
      return res.status(401).json({ success: false, message: "접근 권한이 없습니다." });
    }
  } else {
    // redirect: 로그인페이지로
    return res.status(401).json({ success: false, message: "다시 로그인이 필요합니다." });
  }
};

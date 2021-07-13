const { Router } = require("express");
const router = Router();
const ctrl = require("../controllers");
const vaild = require("../vaildators");

function authRouter(root) {
  root.use("/auth", router);
  /**
   * @description 회원가입
   * @routes POST /auth/signup
   */
  router.post("/signup", vaild.auth.valid_signup, ctrl.auth.post_signup);

  /**
   * @description 로그인
   * @routes POST /auth/signin
   */
  router.post("/signin", ctrl.auth.post_signin);

  /**
   * @description 이메일 인증번호 발송
   * @routes POST /auth/sendEmail
   */
  router.post("/sendEmail", vaild.auth.valid_sendEmail, ctrl.auth.post_sendEmail);
}
module.exports = authRouter;

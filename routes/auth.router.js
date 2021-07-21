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
  router.post("/signup", vaild.auth.post_signup, ctrl.auth.post_signup);

  /**
   * @description 로그인
   * @routes POST /auth/signin
   */
  router.post("/signin", ctrl.auth.post_signin);

  /**
   * @description 이메일 인증번호 발송
   * @routes POST /auth/send
   */
  router.post("/send", vaild.auth.post_send, ctrl.auth.post_send);

  /**
   * @description 이메일 인증번호 확인
   * @routes POST /auth/confirm
   */
  router.post("/confirm", vaild.auth.post_confirm, ctrl.auth.post_confirm);

  /**
   * @description 임시 비밀번호 발급
   * @routes POST /auth/temppwd
   */
  router.post("/temp", vaild.auth.post_temp, ctrl.auth.post_temp);
}
module.exports = authRouter;

const { Router } = require("express");
const router = Router();
const ctrl = require("../controllers");

function authRouter(root) {
  root.use("/auth", router);

  /**
   * @description 회원가입
   * @routes POST /auth/signup
   */
  router.post("/signup", ctrl.auth.post_signup);
}
module.exports = authRouter;

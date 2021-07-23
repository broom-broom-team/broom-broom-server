const { Router } = require("express");
const router = Router();
const ctrl = require("../controllers");
const vaild = require("../vaildators");
const middleware = require("../middlewares");

function userRouter(root) {
  root.use("/user", router);
  router.use(middleware.auth.isAuthenticated);
  /**
   * @description 마이페이지 조회
   * @routes GET /user
   */
  router.get("/", ctrl.user.get_user);
}
module.exports = userRouter;

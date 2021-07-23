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

  /**
   * @description 프로필 수정하기 유저기존정보 불러오기
   * @routes GET /user/edit
   */
  router.get("/edit", ctrl.user.get_edit);

  /**
   * @description 프로필 수정하기
   * @routes POST /user/edit
   */
  router.post("/edit", vaild.user.post_edit, ctrl.user.post_edit);
}
module.exports = userRouter;

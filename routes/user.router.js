const { Router } = require("express");
const router = Router();
const ctrl = require("../controllers");
const valid = require("../validators");
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
  router.post("/edit", middleware.upload.profileUpload.single("image"), valid.user.post_edit, ctrl.user.post_edit);

  /**
   * @description 프로필이미지 기본이미지로 변경하기
   * @routes PUT /user/edit/image
   */
  router.put("/edit/image", ctrl.user.put_edit_image);

  /**
   * @description 비밀번호 변경하기
   * @routes PUT /user/edit/pwd
   */
  router.put("/edit/pwd", valid.user.put_edit_pwd, ctrl.user.put_edit_pwd);

  /**
   * @description 포인트 충전하기 포인트 불러오기
   * @routes GET /user/point
   */
  router.get("/point", ctrl.user.get_point);

  /**
   * @description 포인트 충전하기
   * @routes POST /user/point/:type
   */
  router.post("/point/:type", valid.user.post_point, ctrl.user.post_point);

  /**
   * @description 회원탈퇴하기
   * @routes DELETE /user/delete
   */
  router.delete("/delete", ctrl.user.delete_user);

  /**
   * @description 로그아웃
   * @routes GET /user/logout
   */
  router.get("/logout", ctrl.user.get_logout);
}
module.exports = userRouter;

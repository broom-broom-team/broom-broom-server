const { Router } = require("express");
const router = Router();
const ctrl = require("../controllers");
const valid = require("../validators");
const middleware = require("../middlewares");

function postRouter(root) {
  root.use("/post", router);
  router.use(middleware.auth.isAuthenticated);

  /**
   * @description 심부름 등록하기
   * @routes POST /post
   */
  router.post("/", middleware.upload.postUpload.array("images", 8), valid.post.post_post, ctrl.post.post_post);

  /**
   * @description 심부름 상세보기
   * @routes GET /post/:id
   */
  router.get("/:id", ctrl.post.get_post);

  /**
   * @description 심부름 삭제하기
   * @routes DELETE /post/:id
   */
  router.delete("/:id", ctrl.post.delete_post);

  /**
   * @description 심부름 수정하기 기존 심부름 정보 불러오기
   * @routes GET /post/edit/:id
   */
  router.get("/edit/:id", ctrl.post.get_edit);
}

module.exports = postRouter;

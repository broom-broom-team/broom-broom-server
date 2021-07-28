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
}

module.exports = postRouter;

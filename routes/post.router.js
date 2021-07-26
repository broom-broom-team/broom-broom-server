const { Router } = require("express");
const router = Router();
const ctrl = require("../controllers");
const valid = require("../validators");

function postRouter(root) {
  root.use("/post", router);

  /**
   * @description 심부름 등록하기
   * @routes POST /post
   */
  router.post("/", valid.post.post_post, ctrl.post.post_post);
}

module.exports = postRouter;

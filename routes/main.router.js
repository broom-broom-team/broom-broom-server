const { Router } = require("express");
const router = Router();
const ctrl = require("../controllers");
const valid = require("../validators");
const middleware = require("../middlewares");

function mainRouter(root) {
  root.use("/main", router);
  router.use(middleware.auth.isAuthenticated);

  /**
   * @description 메인 페이지에서 근처 내 게시글 보기
   * @routes GET /main
   */
  router.get("/", ctrl.main.get_main);
}

module.exports = mainRouter;

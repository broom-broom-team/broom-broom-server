const { Router } = require("express");
const router = Router();
const ctrl = require("../controllers");
const valid = require("../validators");
const middleware = require("../middlewares");

function adminRouter(root) {
  root.use("/admin", router);
  router.use(middleware.auth.isAdmin);

  /**
   * @description 충전/환급 요청하기 내역 조회
   * @routes GET /admin/cog?filter&page
   */
  router.get("/cog", ctrl.admin.get_admin_cog);
}

module.exports = adminRouter;

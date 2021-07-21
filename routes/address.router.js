const { Router } = require("express");
const router = Router();
const ctrl = require("../controllers");
const vaild = require("../vaildators");
const middleware = require("../middlewares");

function addressRouter(root) {
  root.use("/address", router);
  router.use(middleware.auth.isAuthenticated);
  /**
   * @description 유저가 설정한 기준지역, 범위 불러오기
   * @routes GET /address
   */
  router.get("/", ctrl.address.get_address);

  /**
   * @description 활동범위에 위치한 근처동네 확인하기
   * @routes POSt /address/check
   */
  router.post("/check", vaild.address.post_check, ctrl.address.post_check);
}

module.exports = addressRouter;

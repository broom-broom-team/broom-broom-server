const { Router } = require("express");
const router = Router();
const ctrl = require("../controllers");
const vaild = require("../vaildators");

function addressRouter(root) {
  root.use("/address", router);
  /**
   * @description
   * @routes
   */
}

module.exports = addressRouter;

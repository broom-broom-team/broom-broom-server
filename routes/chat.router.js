const { Router } = require("express");
const router = Router();
const ctrl = require("../controllers");
const valid = require("../validators");
const middleware = require("../middlewares");

function chatRoter(root) {
  root.use("/chat", router);
  router.use(middleware.auth.isAuthenticated);

  /**
   * @description 개설된 채팅방들 조회
   * @routes GET /rooms
   */
  router.get("/rooms", ctrl.chat.get_chat_rooms);
}

module.exports = chatRoter;

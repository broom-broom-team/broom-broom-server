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
   * @routes GET /chat/rooms
   */
  router.get("/rooms", ctrl.chat.get_chat_rooms);

  /**
   * @description 채팅방 생성
   * @routes POST /chat/room/create/:postId
   * @detail [첫메시지전송] 약속잡기 버튼을 누르고 만약 기존 채팅방이 만들어져있다면 거기로 이동 / 없다면 생성
   */
  router.post("/room/create/:postId", ctrl.chat.post_create_room);
}

module.exports = chatRoter;

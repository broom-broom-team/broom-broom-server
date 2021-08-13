const model = require("../models");
const logger = require("./winston");
const connection = (io) => {
  io.on("connection", (socket) => {
    disconnect(socket);
    findRoom(socket);
    enterRoom(socket);
    newRoom(socket, io);
    message(socket, io);
  });
};

const disconnect = (socket) => {
  socket.on("disconnect", () => {
    logger.info("disconnect socket");
  });
};

const findRoom = (socket) => {
  socket.on("find", (userId) => {
    const strUserId = userId.toString();
    socket.join(strUserId);
    logger.info(`${strUserId}-채팅방 불어오기에서 새로운 채팅방을 받기위해 join합니다.`);
  });
};

// 채팅방 목록에서 채팅방 하나를 들어갔을때
const enterRoom = (socket) => {
  socket.on("enter", (chatRoomId) => {
    const strChatRoomId = chatRoomId.toString();
    socket.join(strChatRoomId);
    logger.info(`${strChatRoomId}-채팅방에 join 합니다.`);
  });
};

const newRoom = (socket, io) => {
  socket.on("newRoom", async (chatRoomId) => {
    const chatRoom = await model.ChatRoom.findOne({ id: chatRoomId });
    const chatRoomInfo = {
      id: chatRoomId,
      lastChatDate: chatRoom.lastChatDate,
      lastChat: chatRoom.lastChat,
      setterId: chatRoom.setterId,
      postId: chatRoom.postId,
    };
    const userId = socket.request.session.passport.user.id;
    const strUserId = userId.toString();
    io.to(strUserId).emit("newRoom", chatRoomInfo);
  });
};

const message = (socket, io) => {
  socket.on("message", async (messageInfo) => {
    // 약속확정, 심부름완료, 보상지급버튼을 클릭하면 프론트엔드에서 content를 "[system]: 약속확정을 하셨습니다.", "[system]: 심부름완료를 하셨습니다.", ...
    const { chatRoomId, content } = messageInfo;
    let lastChat = "";
    const chatMessage = await model.ChatMessage.create({
      content,
      chatRoomId,
      senderId: socket.request.session.passport.user.id,
    });

    if (content.length >= 10) {
      lastChat = content.slice(0, 10);
    } else {
      lastChat = content;
    }
    const message = {
      id: chatMessage.id,
      chatRoomId,
      content,
      senderId,
      createdAt: chatMessage.createdAt, // 보낸 날짜,시간
    };

    await model.ChatRoom.update({ lastChatDate: chatMessage.createdAt, lastChat }, { where: { id: chatRoomId } });
    const strChatRoomId = chatRoomId.toString(); // join으로 들어온 chatRoomId는 String이기 때문에 형변환
    io.to(strChatRoomId).emit("message", message); // 채팅방 목록과 채팅방안에서 message on으로 받음. 만약 처음 채팅방을 만드는 메세지에서 오면 socket newRoom으로 message 보내줌
  });
};

module.exports = connection;

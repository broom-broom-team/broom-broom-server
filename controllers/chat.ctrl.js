const model = require("../models");
const Sequelize = require("sequelize");

exports.get_chat_rooms = async (req, res, next) => {
  const Op = Sequelize.Op;
  try {
    const posts = await model.Post.findAll({
      where: { sellerId: req.user.id },
      attributes: ["id"],
    });
    const postId = posts.map((post) => post.id);
    const chatRooms = await model.ChatRoom.findAll({
      where: {
        [Op.or]: [{ setterId: req.user.id }, { postId: { [Op.in]: postId } }],
      },
      include: { model: model.Post, attributes: ["title", "sellerId"] },
      attributes: ["id", "lastChat", "lastChatDate", "setterId"],
      order: [["lastChatDate", "DESC"]],
    });

    const myChatRooms = [];
    for (let i = 0; i < chatRooms.length; i++) {
      let chatRoom = {
        id: chatRooms[i].id,
        lastChat: chatRooms[i].lastChat,
        lastChatDate: chatRooms[i].lastChatDate,
        postTltie: chatRooms[i].Post.title,
        sellerId: chatRooms[i].Post.sellerId,
        setterId: chatRooms[i].setterId,
        partner: chatRooms[i].setterId === req.user.id ? chatRooms[i].Post.sellerId : chatRooms[i].setterId,
      };
      myChatRooms.push(chatRoom);
    }
    return res.status(200).json({ success: true, message: "회원님의 채팅목록들을 불러옵니다.", myChatRooms });
  } catch (e) {
    return next(e);
  }
};

exports.post_create_room = async (req, res, next) => {
  /**
   * @description 채팅으로 약속잡기 버튼을 누르고나면 주소없는 1:1채팅방 페이지 보여주기(채팅하기 버튼을 누른 게시글 상세보기에서 post 정보로 ui대로 가짜 채팅페이지 만듬)
   * 그러고나서 실제로 버튼을 누르면 이 컨트롤러가 작동함. 정삭적으로 작동한경우 컨트롤러에서 받은 값을 socket message로 보내줌.
   */
  const { postId } = req.params;
  const { content } = req.body;
  try {
    const post = await model.Post.findOne({ where: { id: postId } });
    if (post.sellerId === req.user.id) {
      return res.status(400).json({ success: false, message: "본인이 게시한 심부름에 약속잡기를 할 수 없습니다." });
    }
    const chatRoom = await model.ChatRoom.findOne({
      where: { postId, setterId: req.user.id },
    });
    if (chatRoom) {
      // url: /chat/room/:id
      return res.status(200).json({ success: true, message: "이미 개설된 채팅방이 존재합니다. 해당 채팅방으로 이동합니다.", chatRoomId: chatRoom.id });
    } else {
      const createdChatRoom = await model.ChatRoom.create({ setterId: req.user.id, postId });
      return res.status(200).json({
        success: true,
        message: "채팅방 개설이 완료되었습니다. 이 작업을 마친 후에 socket으로 message에 content와 chatRoomId를 보내주세요.",
        chatRoomId: createdChatRoom.id,
        content,
      });
    }
  } catch (e) {
    return next(e);
  }
};

exports.post_chat_image = async (req, res, next) => {
  // params나 query는 string으로 들어온다. => 형변환 필요
  const { chatRoomId } = req.params;
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "파일이 없어 사진전송에 실패했습니다." });
    }
    const messageImageURI = req.file.location;
    const message = await model.ChatMessage.create({ chatRoomId: chatRoomId, senderId: req.user.id, messageImageURI });
    return res.status(200).json({ success: true, message: "사진을 전송합니다. 받은 데이터는 socket.emit('imageMessage')를 통해 보내주세요.", message });
  } catch (e) {
    return next(e);
  }
};

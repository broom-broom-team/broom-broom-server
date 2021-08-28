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
    return res.status(200).json({ success: true, message: "회원님의 채팅목록들을 불러옵니다.", data: myChatRooms });
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
      // url: /chat/room/:d
      return res.status(200).json({ success: true, message: "이미 개설된 채팅방이 존재합니다. 해당 채팅방으로 이동합니다.", data: chatRoom.id });
    } else {
      const createdChatRoom = await model.ChatRoom.create({ setterId: req.user.id, postId });
      const data = { chatRoomId: createdChatRoom.id, content };
      return res.status(200).json({
        success: true,
        message: "채팅방 개설이 완료되었습니다. 이 작업을 마친 후에 socket으로 message에 content와 chatRoomId를 보내주세요.",
        data,
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
    return res.status(200).json({ success: true, message: "사진을 전송합니다. 받은 데이터는 socket.emit('imageMessage')를 통해 보내주세요.", data: message });
  } catch (e) {
    return next(e);
  }
};

exports.put_chat_status = async (req, res, next) => {
  const { chatRoomId } = req.params;
  const { type } = req.query;
  try {
    const chatRoom = await model.ChatRoom.findOne({ where: { id: chatRoomId }, attributes: ["postId", "setterId"] });
    const post = await model.Post.findOne({ where: { id: chatRoom.postId } });
    if (type === "reserve") {
      // 약속확정 버튼을 눌렀을 때
      if (post.status === "basic" && post.sellerId === req.user.id) {
        const user = await model.User.findOne({ where: { id: req.user.id }, attributes: ["cash"] });
        if (user.cash >= post.price) {
          // TODO: 트랜잭션 넣기
          await model.Post.update({ status: "proceed", buyerId: chatRoom.setterId }, { where: { id: post.id } });
          await model.User.update({ cash: user.cash - post.price }, { where: { id: req.user.id } });
          return res.status(200).json({ success: true, message: `약속확정이 완료되었습니다.` });
        } else {
          return res.status(400).json({ success: false, message: "회원님이 소지하신 금액보다 심부름 단가가 더 높아 약속확정이 불가능합니다." });
        }
      } else {
        return res.status(400).json({ success: false, message: "약속확정이 불가능합니다. post의 상태나 로그인된 유저의 정보를 다시 확인해주세요." });
      }
    } else if (type === "finish") {
      // 보상지급 버튼을 눌렀을 때
      if ((post.status === "proceed" || post.status === "stop") && post.sellerId === req.user.id) {
        const user = await model.User.findOne({ where: { id: post.buyerId }, attributes: ["cash"] });
        await model.Post.update({ status: "end" }, { where: { id: post.id } });
        await model.User.update({ cash: user.cash + post.price }, { where: { id: post.buyerId } });
        return res.status(200).json({ success: true, message: `보상지급이 완료되었습니다.` });
      } else {
        return res.status(400).json({ success: false, message: "보상지급이 불가능합니다. post의 상태나 로그인된 유저의 정보를 다시 확인해주세요." });
      }
    } else if (type === "hold") {
      // 보상보류 버튼을 눌렀을 때
      if (post.status === "proceed" && post.sellerId === req.user.id) {
        await model.Post.update({ status: "stop" }, { where: { id: post.id } });
        return res.status(200).json({ success: true, message: `보상지급보류가 완료되었습니다.` });
      } else {
        return res.status(400).json({ success: false, message: "보상지급보류가 불가능합니다. post의 상태나 로그인된 유저의 정보를 다시 확인해주세요." });
      }
    } else {
      return res.status(400).json({ success: false, message: "type은 reserve, finish, give로만 입력 가능합니다." });
    }
  } catch (e) {
    return next(e);
  }
};

exports.get_chat_room = async (req, res, next) => {
  // TODO: 채팅방에다가 참여자 필드를 만드는게 좋을 것 같음
  // TODO: 채팅방 조회는 참여자만 가능하게 하기로 이중으로 막아주면 좋을 것 같음
  const { chatRoomId } = req.params;
  try {
    // 채팅내용은 카카오톡과 마찬가지로 위에 내용들이 오래된 내용들이 나옴
    const chatMessages = await model.ChatMessage.findAll({
      where: { chatRoomId },
      order: [["createdAt", "ASC"]],
      include: {
        model: model.User,
        attributes: ["id", "nickname", "mannerPoint"],
        include: [
          { model: model.UserAddress, attributes: ["id", "districtId"], include: { model: model.District, attributes: ["simpleAddress"] } },
          { model: model.ProfileImage, attributes: ["profileImageURI"] },
        ],
      },
    });
    const chatRoom = await model.ChatRoom.findOne({
      where: { id: chatRoomId },
      attributes: ["id", "setterId"],
      include: { model: model.Post, attributes: ["id", "title", "status", "sellerId"] },
    });
    const chatRoomInfo = {
      id: chatRoom.id,
      setterId: chatRoom.setterId,
      sellerId: chatRoom.Post.setterId,
      postId: chatRoom.Post.postId,
      postTitle: chatRoom.Post.title,
      postStatus: chatRoom.Post.status,
      partner: chatRoom.setterId === req.user.id ? chatRoom.Post.setterId : chatRoom.setterId,
    };
    const messages = [];
    for (let i = 0; i < chatMessages.length; i++) {
      let message = {
        id: chatMessages[i].id,
        content: chatMessages[i].content,
        messageImageURI: chatMessages[i].messageImageURI,
        createdAt: chatMessages[i].createdAt,
        chatRoomId: chatMessages[i].chatRoomId,
        senderId: chatMessages[i].senderId,
        senderNickname: chatMessages[i].User.nickname,
        senderMannerPoint: chatMessages[i].User.mannerPoint,
        senderAddress: chatMessages[i].User.UserAddresses[0].District.simpleAddress,
        senderProfileImage: chatMessages[i].User.ProfileImages[0].profileImageURI,
      };
      messages.push(message);
    }
    const data = { chatRoomInfo, messages };
    return res.status(200).json({ success: true, message: "해당 채팅방의 채팅내용을 불러옵니다.", data });
  } catch (e) {
    return next(e);
  }
};

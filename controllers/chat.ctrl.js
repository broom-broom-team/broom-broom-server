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
        partner: chatRooms[i].setterId === req.user.id ? chatRooms[i].sellerId : chatRooms[i].setterId,
      };
      myChatRooms.push(chatRoom);
    }
    return res.status(200).json({ success: true, message: "회원님의 채팅목록들을 불러옵니다.", myChatRooms });
  } catch (e) {
    return next(e);
  }
};

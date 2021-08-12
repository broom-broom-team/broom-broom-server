const Sequelize = require("sequelize");

module.exports = class ChatRoom extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        // 외래키로만 구성
        lastChatDate: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        lastChat: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "ChatRoom",
        tableName: "chatRooms",
        paranoid: true,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  static associate(db) {
    db.ChatRoom.belongsTo(db.User, { foreignKey: "setterId", targetKey: "id" });
    db.ChatRoom.belongsTo(db.Post, { foreignKey: "postId", targetKey: "id" });
    db.ChatRoom.hasMany(db.ChatMessage, { foreignKey: "chatRoomId", sourceKey: "id" });
  }
};

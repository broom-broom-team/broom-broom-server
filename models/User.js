const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        isAdmin: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: 0,
        },
        name: {
          type: Sequelize.STRING(10),
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(40),
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        nickname: {
          type: Sequelize.STRING(10),
          allowNull: false,
          unique: true,
        },
        phoneNumber: {
          type: Sequelize.STRING(15),
          allowNull: false,
          unique: true,
        },
        mannerPoint: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        cash: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "User",
        tableName: "users",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.Post, { foreignKey: "sellerId", sourceKey: "id" });
    db.User.hasMany(db.UserAddress, { foreignKey: "userId", sourceKey: "id" });
    db.User.hasMany(db.AdminCog, { foreignKey: "userId", sourceKey: "id" });
    db.User.hasMany(db.ProfileImage, { foreignKey: "userId", sourceKey: "id" });
    db.User.hasMany(db.ChatRoom, { foreignKey: "setterId", sourceKey: "id" });
    db.User.hasMany(db.ChatMessage, { foreignKey: "senderId", sourceKey: "id" });
    db.User.hasMany(db.Review, { foreignKey: "registerId", sourceKey: "id" });
  }
};

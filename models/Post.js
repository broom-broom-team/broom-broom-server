const Sequelize = require("sequelize");

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        buyerId: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        title: {
          type: Sequelize.STRING(40),
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM("basic", "proceed", "complete", "end", "stop", "close"),
          allowNull: false,
          defaultValue: "basic",
        },
        price: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        requiredTime: {
          type: Sequelize.STRING(10),
          allowNull: false,
        },
        deadline: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Post",
        tableName: "posts",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  static associate(db) {
    db.Post.belongsTo(db.User, { foreignKey: "sellerId", targetKey: "id" });
    db.Post.belongsTo(db.District, { foreignKey: "sellingDistrict", targetKey: "adm_cd" });
    db.Post.hasMany(db.PostImage, { foreignKey: "postId", sourceKey: "id" });
    db.Post.hasMany(db.ChatRoom, { foreignKey: "postId", sourceKey: "id" });
    db.Post.hasMany(db.Review, { foreignKey: "postId", sourceKey: "id" });
  }
};

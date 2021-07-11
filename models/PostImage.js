const Sequelize = require("sequelize");

module.exports = class PostImage extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        postImageURI: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "PostImage",
        tableName: "postImages",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  static associate(db) {
    db.PostImage.belongsTo(db.Post, { foreignKey: "postId", targetKey: "id" });
  }
};

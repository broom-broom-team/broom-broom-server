const Sequelize = require("sequelize");

module.exports = class ProfileImage extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        profileImageURI: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "ProfileImage",
        tableName: "profileImages",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  static associate(db) {
    db.ProfileImage.belongsTo(db.User, { foreignKey: "userId", targetKey: "id" });
  }
};

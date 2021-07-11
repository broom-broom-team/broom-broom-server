const Sequelize = require("sequelize");

module.exports = class UserAddress extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        addressScope: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        neighboehoods: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "UserAddress",
        tableName: "userAddresses",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  static associate(db) {
    db.UserAddress.belongsTo(db.District, { foreignKey: "districtId", targetKey: "id" });
    db.UserAddress.belongsTo(db.User, { foreignKey: "userId", targetKey: "id" });
  }
};

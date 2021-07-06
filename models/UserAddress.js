const Sequelize = require("sequelize");

module.exports = class UserAddress extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        simpleAddress: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
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
  static associate(db) {}
};

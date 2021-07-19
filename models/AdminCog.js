const Sequelize = require("sequelize");

module.exports = class AdminCog extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        type: {
          type: Sequelize.ENUM("refund", "charge"),
          allowNull: false,
        },
        account: {
          type: Sequelize.STRING(40),
          allowNull: true,
        },
        bankName: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
        amount: {
          type: Sequelize.INTEGER,
          allowNull: trues,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "AdminCog",
        tableName: "adminCogs",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  static associate(db) {
    db.Cog.belongsTo(db.User, { foreignKey: "userId", targetKey: "id" });
  }
};

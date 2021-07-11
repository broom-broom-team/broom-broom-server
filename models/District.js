const Sequelize = require("sequelize");

module.exports = class District extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        ADMNM: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
        ADMCD: {
          type: Sequelize.BIGINT(30),
          allowNull: true,
        },
        SIDONM: {
          type: Sequelize.STRING(20),
          allowNull: true,
        },
        SGGNM: {
          type: Sequelize.STRING(20),
          allowNull: true,
        },
        EMDNM: {
          type: Sequelize.STRING(20),
          allowNull: true,
        },
        simpleAddress: {
          type: Sequelize.STRING(20),
          allowNull: true,
        },
        X: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        Y: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        geopoint: {
          type: Sequelize.GEOMETRY("POINT", 4326),
          allowNull: true,
        },
        geopolygon: {
          type: Sequelize.GEOMETRY("POLYGON", 4326),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "District",
        tableName: "districts",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  static associate(db) {
    db.District.hasMany(db.Post, { foreignKey: "sellingDistrict", sourceKey: "id" });
    db.District.hasMany(db.UserAddress, { foreignKey: "districtId", sourceKey: "id" });
  }
};

const Sequelize = require("sequelize");

module.exports = class District extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        adm_nm: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        adm_cd: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        adm_cd2: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        sgg: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        sido: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        sidonm: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        sggnm: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        emdnm: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        simpleaddress: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        geopoint: {
          type: Sequelize.GEOMETRY("POINT", 4326),
          allowNull: false,
        },
        geopolygon: {
          type: Sequelize.GEOMETRY("POLYGON", 4326),
          allowNull: false,
        },
        version: {
          type: Sequelize.DATEONLY,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: true,
        modelName: "District",
        tableName: "districts",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  static associate(db) {
    db.District.hasMany(db.Post, { foreignKey: "sellingDistrict", sourceKey: "adm_cd" });
    db.District.hasMany(db.UserAddress, { foreignKey: "districtId", sourceKey: "adm_cd" });
  }
};

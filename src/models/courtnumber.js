"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CourtNumber extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CourtNumber.belongsTo(models.BadmintonCourt, {
        foreignKey: { name: "badmintonCourtId", allowNull: false },
        targetKey: "id",
      });
      CourtNumber.hasMany(models.Schedule, {
        foreignKey: "courtNumberId",
        as: "schedules",
        sourceKey: "id",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  CourtNumber.init(
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      name: DataTypes.STRING,
      badmintonCourtId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
    },
    {
      sequelize,
      modelName: "CourtNumber",
    }
  );
  return CourtNumber;
};

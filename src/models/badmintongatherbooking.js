"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BadmintonGatherBooking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BadmintonGatherBooking.belongsTo(models.User, {
        foreignKey: { name: "userId", allowNull: false },
        as: "user",
        targetKey: "id",
      });
      BadmintonGatherBooking.belongsTo(models.BadmintonGather, {
        foreignKey: { name: "badmintonGatherId", allowNull: false },
        as: "badmintonGather",
        targetKey: "id",
      });
    }
  }
  BadmintonGatherBooking.init(
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      userId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      badmintonGatherId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      numberMale: DataTypes.INTEGER,
      numberFemale: DataTypes.INTEGER,
      note: DataTypes.TEXT,
      status: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: "PENDING_APPROVAL",
      },
    },
    {
      sequelize,
      modelName: "BadmintonGatherBooking",
    }
  );
  return BadmintonGatherBooking;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BadmintonGather extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BadmintonGather.belongsTo(models.User, {
        foreignKey: { name: "userId", allowNull: false },
        as: "user",
        targetKey: "id",
      });
      BadmintonGather.hasMany(models.BadmintonGatherBooking, {
        foreignKey: "badmintonGatherId",
        as: "badmintonGatherBookings",
        sourceKey: "id",
        onDelete: "CASCADE",
        hooks: true,
      });
      BadmintonGather.hasMany(models.BadmintonGatherComment, {
        foreignKey: "badmintonGatherId",
        as: "badmintonGatherComments",
        sourceKey: "id",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  BadmintonGather.init(
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
      nameClub: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      badmintonCourtName: DataTypes.STRING,
      district: DataTypes.STRING,
      ward: DataTypes.STRING,
      address: DataTypes.STRING,
      lang: DataTypes.DECIMAL(9, 6),
      lat: DataTypes.DECIMAL(9, 6),
      courtNumber: DataTypes.STRING,
      startTime: DataTypes.STRING,
      endTime: DataTypes.STRING,
      appointmentDate: DataTypes.DATE,
      totalMale: DataTypes.INTEGER,
      totalFemale: DataTypes.INTEGER,
      constPerMale: DataTypes.INTEGER,
      constPerFemale: DataTypes.INTEGER,
      imgCourt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      level: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "BadmintonGather",
    }
  );
  return BadmintonGather;
};

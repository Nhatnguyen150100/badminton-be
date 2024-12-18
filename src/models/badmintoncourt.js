"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BadmintonCourt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BadmintonCourt.belongsTo(models.User, {
        foreignKey: { name: "userId", allowNull: false },
        as: "user",
        targetKey: "id",
      });
      BadmintonCourt.hasMany(models.CourtNumber, {
        foreignKey: "badmintonCourtId",
        as: "courtNumbers",
        sourceKey: "id",
        onDelete: "CASCADE",
        hooks: true,
      });
      BadmintonCourt.hasMany(models.TimeBooking, {
        foreignKey: "badmintonCourtId",
        as: "timeBookings",
        sourceKey: "id",
        onDelete: "CASCADE",
        hooks: true,
      });
      BadmintonCourt.hasMany(models.Schedule, {
        foreignKey: "badmintonCourtId",
        as: "schedules",
        sourceKey: "id",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  BadmintonCourt.init(
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      name: DataTypes.STRING,
      district: DataTypes.STRING,
      ward: DataTypes.STRING,
      address: DataTypes.STRING,
      lang: DataTypes.DECIMAL(9, 6),
      lat: DataTypes.DECIMAL(9, 6),
      userId: DataTypes.UUID,
      imageCourt: DataTypes.STRING,
      description: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "BadmintonCourt",
    }
  );
  return BadmintonCourt;
};

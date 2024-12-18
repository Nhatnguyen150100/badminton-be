"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Schedule.belongsTo(models.BadmintonCourt, {
        foreignKey: { name: "badmintonCourtId", allowNull: false },
        as: "badmintonCourt",
        targetKey: "id",
      });
      Schedule.belongsTo(models.TimeBooking, {
        foreignKey: { name: "timeBookingId", allowNull: false },
        as: "timeBooking",
        targetKey: "id",
      });
      Schedule.belongsTo(models.CourtNumber, {
        foreignKey: { name: "courtNumberId", allowNull: false },
        as: "courtNumber",
        targetKey: "id",
      });
      Schedule.hasMany(models.UserBooking, {
        foreignKey: "scheduleId",
        as: "userBookings",
        sourceKey: "id",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  Schedule.init(
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      badmintonCourtId: DataTypes.UUID,
      courtNumberId: DataTypes.UUID,
      timeBookingId: DataTypes.UUID,
      appointmentDate: DataTypes.DATE,
      constBooking: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Schedule",
    }
  );
  return Schedule;
};

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TimeBooking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TimeBooking.belongsTo(models.BadmintonCourt, {
        foreignKey: { name: "badmintonCourtId", allowNull: false },
        targetKey: "id",
      });
      TimeBooking.hasMany(models.Schedule, {
        foreignKey: "timeBookingId",
        as: "schedules",
        sourceKey: "id",
        onDelete: "CASCADE",
        hooks: true
      });
    }
  }
  TimeBooking.init({
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    startTime: DataTypes.STRING,
    endTime: DataTypes.STRING,
    badmintonCourtId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'TimeBooking',
  });
  return TimeBooking;
};
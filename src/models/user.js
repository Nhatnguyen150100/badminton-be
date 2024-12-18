"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.BadmintonCourt, {
        foreignKey: "userId",
        as: "badmintonCourt",
        sourceKey: "id",
        onDelete: "CASCADE",
        hooks: true
      });
      User.hasMany(models.UserBooking, {
        foreignKey: "userId",
        as: "userBookings",
        sourceKey: "id",
        onDelete: "CASCADE",
        hooks: true
      });
      User.hasMany(models.BadmintonGather, {
        foreignKey: "userId",
        as: "badmintonGathers",
        sourceKey: "id",
        onDelete: "CASCADE",
        hooks: true
      });
      User.hasMany(models.BadmintonGatherBooking, {
        foreignKey: "userId",
        as: "badmintonGatherBookings",
        sourceKey: "id",
        onDelete: "CASCADE",
        hooks: true
      });
      User.hasMany(models.BadmintonGatherComment, {
        foreignKey: "userId",
        as: "badmintonGatherComments",
        sourceKey: "id",
        onDelete: "CASCADE",
        hooks: true
      });
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      password: DataTypes.STRING,
      fullName: DataTypes.STRING,
      gender: DataTypes.STRING,
      avatar: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      accountBalance: DataTypes.INTEGER,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BadmintonGatherComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BadmintonGatherComment.belongsTo(models.User, {
        foreignKey: { name: "userId", allowNull: false },
        as: "user",
        targetKey: "id",
      });
      BadmintonGatherComment.belongsTo(models.BadmintonGather, {
        foreignKey: { name: "badmintonGatherId", allowNull: false },
        as: "badmintonGather",
        targetKey: "id",
      });
    }
  }
  BadmintonGatherComment.init({
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    badmintonGatherId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'BadmintonGatherComment',
  });
  return BadmintonGatherComment;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TransactionHistory.belongsTo(models.User, {
        foreignKey: { name: "transactionUserId", allowNull: false },
        as: "transactionUser",
        targetKey: "id",
        through: { TransactionHistory },
      });
      TransactionHistory.belongsTo(models.User, {
        foreignKey: { name: "receiveUserId", allowNull: false },
        as: "receiveUser",
        targetKey: "id",
        through: { TransactionHistory },
      });
    }
  }
  TransactionHistory.init({
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    transactionUserId: DataTypes.UUID,
    receiveUserId: DataTypes.UUID,
    transactionType: DataTypes.ENUM('GATHER_BOOKING', 'COURT_BOOKING'),
    transactionAmount: DataTypes.INTEGER,
    discountedAdmin: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TransactionHistory',
  });
  return TransactionHistory;
};
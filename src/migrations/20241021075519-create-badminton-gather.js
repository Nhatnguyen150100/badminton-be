"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("BadmintonGathers", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        allowNull: false,
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        references: {
          model: {
            tableName: "Users",
            name: "userId",
          },
          key: "id",
        },
      },
      nameClub: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      badmintonCourtName: {
        type: Sequelize.STRING,
      },
      district: {
        type: Sequelize.STRING,
      },
      ward: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      courtNumber: {
        type: Sequelize.STRING,
      },
      startTime: {
        type: Sequelize.STRING,
      },
      endTime: {
        type: Sequelize.STRING,
      },
      appointmentDate: {
        type: Sequelize.DATE,
      },
      totalMale: {
        type: Sequelize.INTEGER,
      },
      totalFemale: {
        type: Sequelize.INTEGER,
      },
      constPerMale: {
        type: Sequelize.INTEGER,
      },
      constPerFemale: {
        type: Sequelize.INTEGER,
      },
      lang: {
        type: Sequelize.DECIMAL(9, 6),
      },
      lat: {
        type: Sequelize.DECIMAL(9, 6),
      },
      imgCourt: {
        type: Sequelize.STRING,
      },
      level: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("BadmintonGathers");
  },
};

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          id: "d511aeab-f46d-408c-a29d-55ad1855651a",
          email: "user1@gmail.com",
          role: "USER",
          password:
            "$2b$10$6eXQVPv8SBbKvivehAXVWe/lotzezRfMWZ3oc82vfxHUYZnKp0gVG", // plain = password
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "d511aeab-f46d-248c-a29d-55ad1855651a",
          email: "admin@gmail.com",
          role: "ADMIN",
          password:
            "$2b$10$6eXQVPv8SBbKvivehAXVWe/lotzezRfMWZ3oc82vfxHUYZnKp0gVG", // plain = password
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Users', null, {});
  },
};

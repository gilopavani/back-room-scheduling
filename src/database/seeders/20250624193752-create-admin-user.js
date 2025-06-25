"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
        id: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
        name: "Admin",
        last_name: "User",
        email: "admin@gmail.com",
        role: "admin",
        status: "active",
        can_view_logs: true,
        can_manage_scheduling: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("user_passwords", [
      {
        user_id: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
        password: "$2b$10$EIXjYz5Zy5Zy5Zy5Zy5ZyOeXxYz5Zy5Zy5Zy5Zy5Zy5Zy5Zy5Zy",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", {
      email: "admin@gmail.com",
    });
  },
};

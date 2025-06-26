"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
        id: "20ca4c0a-7c69-4168-b186-5758e9c77668",
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
        id: "26da4aaf-defb-4cdc-ad49-cc128135958d",
        user_id: "20ca4c0a-7c69-4168-b186-5758e9c77668",
        password_hash:
          "$2b$10$4ZZfT0qZWrm.B.0pKoppfe//KDm76jUQtzfPIS6gSKXjdZO4D9r/i",
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

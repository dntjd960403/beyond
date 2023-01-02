"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      nickname: {
        type: Sequelize.STRING,
        unique: true,
      },
      job: {
        type: Sequelize.STRING,
      },
      level: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      exp: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      power: {
        type: Sequelize.INTEGER,
        defaultValue: 10,
      },
      magic: {
        type: Sequelize.INTEGER,
        defaultValue: 10,
      },
      defense: {
        type: Sequelize.INTEGER,
        defaultValue: 10,
      },
      HP: {
        type: Sequelize.INTEGER,
        defaultValue: 100,
      },
      MP: {
        type: Sequelize.INTEGER,
        defaultValue: 100,
      },
      money: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
    await queryInterface.dropTable("Users");
  },
};
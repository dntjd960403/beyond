"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Equips", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nickname: {
        type: Sequelize.STRING,
        references: {
          model: "Users",
          key: "nickname",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      helmet: {
        type: Sequelize.STRING,
        references: {
          model: "Items",
          key: "name",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      armor: {
        type: Sequelize.STRING,
        references: {
          model: "Items",
          key: "name",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      weapon: {
        type: Sequelize.STRING,
        references: {
          model: "Items",
          key: "name",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      keyRing1: {
        type: Sequelize.STRING,
        references: {
          model: "Items",
          key: "name",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      keyRing2: {
        type: Sequelize.STRING,
        references: {
          model: "Items",
          key: "name",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      keyRing3: {
        type: Sequelize.STRING,
        references: {
          model: "Items",
          key: "name",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
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
    await queryInterface.dropTable("Equips");
  },
};

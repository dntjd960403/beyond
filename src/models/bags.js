"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Bags.belongsTo(models.Items, {
        foreignKey: "itemName",
        targetKey: "name",
        onDelete: "cascade",
        onUpdate: "cascade",
      });
    }
  }
  Bags.init(
    {
      nickname: {
        type: DataTypes.STRING,
        references: {
          model: "Users",
          key: "nickname",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      itemName: {
        type: DataTypes.STRING,
        references: {
          model: "Items",
          key: "name",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Bags",
    }
  );
  return Bags;
};

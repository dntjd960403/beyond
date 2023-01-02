"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.hasMany(models.Bags, {
      //   as: "Bags",
      //   foreignKey: "itemName",
      //   sourceKey: "name",
      //   onDelete: "cascade",
      //   onUpdate: "cascade",
      // });
    }
  }
  Items.init(
    {
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      explanation: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Items",
    }
  );
  return Items;
};

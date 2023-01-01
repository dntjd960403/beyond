"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.hasMany(models.Bags, {
      //   as: "Bags",
      //   foreignKey: "nickname",
      //   sourceKey: "nickname",
      //   onDelete: "cascade",
      //   onUpdate: "cascade",
      // });
    }
  }
  Users.init(
    {
      userId: DataTypes.STRING,
      password: DataTypes.STRING,
      nickname: DataTypes.STRING,
      job: DataTypes.STRING,
      level: DataTypes.INTEGER,
      exp: DataTypes.INTEGER,
      power: DataTypes.INTEGER,
      magic: DataTypes.INTEGER,
      defense: DataTypes.INTEGER,
      HP: DataTypes.INTEGER,
      MP: DataTypes.INTEGER,
      money: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Equips extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Equips.belongsTo(models.Items, {
        foreignKey: "helmet",
        targetKey: "name",
        onDelete: "cascade",
        onUpdate: "cascade",
      });
      models.Equips.belongsTo(models.Items, {
        foreignKey: "armor",
        targetKey: "name",
        onDelete: "cascade",
        onUpdate: "cascade",
      });
      models.Equips.belongsTo(models.Items, {
        foreignKey: "weapon",
        targetKey: "name",
        onDelete: "cascade",
        onUpdate: "cascade",
      });
      models.Equips.belongsTo(models.Items, {
        foreignKey: "keyRing1",
        targetKey: "name",
        onDelete: "cascade",
        onUpdate: "cascade",
      });
      models.Equips.belongsTo(models.Items, {
        foreignKey: "keyRing2",
        targetKey: "name",
        onDelete: "cascade",
        onUpdate: "cascade",
      });
      models.Equips.belongsTo(models.Items, {
        foreignKey: "keyRing3",
        targetKey: "name",
        onDelete: "cascade",
        onUpdate: "cascade",
      });
    }
  }
  Equips.init(
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
      helmet: {
        type: DataTypes.STRING,
        references: {
          model: "Items",
          key: "name",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      armor: {
        type: DataTypes.STRING,
        references: {
          model: "Items",
          key: "name",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      weapon: {
        type: DataTypes.STRING,
        references: {
          model: "Items",
          key: "name",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      keyRing1: {
        type: DataTypes.STRING,
        references: {
          model: "Items",
          key: "name",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      keyRing2: {
        type: DataTypes.STRING,
        references: {
          model: "Items",
          key: "name",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      keyRing3: {
        type: DataTypes.STRING,
        references: {
          model: "Items",
          key: "name",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
    },
    {
      sequelize,
      modelName: "Equips",
    }
  );
  return Equips;
};

'use strict';
module.exports = (sequelize, DataTypes,Sequelize) => {
  const Settings = sequelize.define('Settings', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    settingsName: {
      type: DataTypes.STRING
    },
    settingsKey: {
      type: DataTypes.STRING,
    },
    settingsValue: {
      type: DataTypes.STRING,
    },
    settingsGroup: {
      type: DataTypes.STRING,
    },  
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {});
  Settings.associate = function(models) {
  
  };
  return Settings;
};

'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Donates extends Model {
    static associate(models) {
      // define association here
    }
  }
  Donates.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    shortDesc: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    remarks: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    donateDesc: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    btnText: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    btnLink: {
      allowNull: true,
      type: DataTypes.STRING
    },
    fileUrl1: {
      allowNull: true,
      type: DataTypes.STRING
    },
    fileUrl2: {
      allowNull: true,
      type: DataTypes.STRING
    },    
    status:{
      type:DataTypes.INTEGER,
      defaultValue:1
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE
    },
    createdBy: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    updatedAt: {
        allowNull: true,
        type: DataTypes.DATE
    },
    updatedBy: {
        allowNull: true,
        type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'Donates',
  });
  return Donates;
};
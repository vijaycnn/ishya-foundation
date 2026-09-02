'use strict';
const {  Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mentors extends Model {
    
    static associate(models) {
      // define association here
    }
  }
  Mentors.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,     
      type: DataTypes.STRING,
    },
    orderNumber:{
      type:DataTypes.INTEGER,
      defaultValue:1
    },
    title: {
      allowNull: true,
      type: DataTypes.STRING
    },
    fileUrl: {
      allowNull: true,
      type: DataTypes.STRING
    },
    remark1: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    remark2: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    status:{
      type:DataTypes.INTEGER,
      defaultValue:1
    },
    isdeleted:{
      type:DataTypes.INTEGER,
      defaultValue:0
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
    modelName: 'Mentors',
  });
  return Mentors;
};
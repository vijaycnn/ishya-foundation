'use strict';
const {  Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LearningPages extends Model {
    
    static associate(models) {
      // define association here
    }
  }
  LearningPages.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    type: {
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
    attachFileUrl: {
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
    createdByUser: {
        allowNull: true,
        type: DataTypes.STRING
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
    modelName: 'LearningPages',
  });
  return LearningPages;
};
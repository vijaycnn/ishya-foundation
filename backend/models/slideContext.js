'use strict';
const {  Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SlideContexts extends Model {
    
    static associate(models) {
      // define association here
    }
  }
  SlideContexts.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    slideNumber: {
      allowNull: false,     
      type: DataTypes.STRING,
    },
    title: {
      allowNull: true,
      type: DataTypes.STRING
    },
    subtitle: {
      allowNull: true,
      type: DataTypes.STRING
    },
    remark: {
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
    modelName: 'SlideContexts',
  });
  return SlideContexts;
};
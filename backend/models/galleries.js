'use strict';
const {  Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Galleries extends Model {
    
    static associate(models) {
      // define association here
    }
  }
  Galleries.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING
    },
    title: {
      allowNull: true,     
      type: DataTypes.STRING,
      defaultValue: "",
    },
    fileUrl: {
      allowNull: false,
      type: DataTypes.STRING
    },
    remarks: {
      allowNull: true,
      type: DataTypes.STRING
    },
    run_on_homepage: {
      allowNull: false,
      type:DataTypes.INTEGER,
      defaultValue:1
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
    modelName: 'Galleries',
  });
  return Galleries;
};
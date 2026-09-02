'use strict';
const {  Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BannerGalleries extends Model {
    
    static associate(models) {
      // define association here
    }
  }
  BannerGalleries.init({
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
    fileUrl: {
      allowNull: false,     
      type: DataTypes.STRING,
    },
    title: {
      allowNull: true,     
      type: DataTypes.STRING,
    },
    description: {
      allowNull: true,     
      type: DataTypes.STRING,
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
    modelName: 'BannerGalleries',
  });
  return BannerGalleries;
};
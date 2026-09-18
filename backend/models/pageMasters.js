'use strict';
const {  Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PageMasters extends Model {
    static associate(models) {
      // define association here
    //   PageMasters.hasMany(models.CityMaster, {foreignKey: 'pageId'});
    }
  }
  PageMasters.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    status:{
      type:DataTypes.INTEGER,
      defaultValue:1
    },
    videofileUrl: {
      allowNull: true,
      type: DataTypes.STRING
    },  
    videofileStatus:{
      type:DataTypes.INTEGER,
      defaultValue:0
    },
    partnerPageTitle: {
      allowNull: true,
      type: DataTypes.STRING
    },  
    partnerPageStatus:{
      type:DataTypes.INTEGER,
      defaultValue:0
    },
    footerImgfileUrl: {
      allowNull: true,
      type: DataTypes.STRING
    },  
    footerImgStatus:{
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
    modelName: 'PageMasters',
  });
  return PageMasters;
};
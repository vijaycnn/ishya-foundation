'use strict';
const {  Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PageMasters extends Model {
    static associate(models) {
      // define association here
      PageMasters.hasMany(models.PageBanners, {foreignKey: 'pageId'});
      PageMasters.hasMany(models.PageAbouts, {foreignKey: 'pageId'});
      PageMasters.hasMany(models.PageMaps, {foreignKey: 'pageId'});
      PageMasters.hasMany(models.PageVideos, {foreignKey: 'pageId'});
      PageMasters.hasMany(models.PageZigZags, {foreignKey: 'pageId'});
      PageMasters.hasMany(models.PageFeatures, {foreignKey: 'pageId'});
      PageMasters.hasMany(models.PageFounders, {foreignKey: 'pageId'});
      PageMasters.hasMany(models.PageTeams, {foreignKey: 'pageId'});
      PageMasters.hasMany(models.PageValues, {foreignKey: 'pageId'});
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
    contactNumber: {
      allowNull: true,
      type: DataTypes.STRING
    }, 
    status:{
      type:DataTypes.INTEGER,
      defaultValue:1
    },
    partnerPageTitle: {
      allowNull: true,
      type: DataTypes.STRING
    },  
    partnerPageHeading: {
      allowNull: true,
      type: DataTypes.STRING
    },  
    partnerPageSubHeading: {
      allowNull: true,
      type: DataTypes.STRING
    },  
    partnerPageStatus:{
      type:DataTypes.INTEGER,
      defaultValue:0
    },
    testimonialTitle: {
      allowNull: true,
      type: DataTypes.STRING
    },  
    testimonialHeading: {
      allowNull: true,
      type: DataTypes.STRING
    }, 
    testimonialStatus:{
      type:DataTypes.INTEGER,
      defaultValue:0
    },
    zigzagTitle: {
      allowNull: true,
      type: DataTypes.STRING
    },  
    zigzagStatus:{
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
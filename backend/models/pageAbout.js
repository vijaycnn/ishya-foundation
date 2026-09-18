'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PageAbout extends Model {
    static associate(models) {
      // define association here
      PageAbout.belongsTo(models.PageMasters, {foreignKey: 'pageId'});
    }
  }
  PageAbout.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    pageId: DataTypes.INTEGER,
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    title2: {
      allowNull: true,
      type: DataTypes.STRING
    },
    title3: {
      allowNull: true,
      type: DataTypes.STRING
    },
    remarks: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    fileUrl1: {
      allowNull: true,
      type: DataTypes.STRING
    },
    fileUrlTxt1: {
      allowNull: true,
      type: DataTypes.STRING
    },
    fileUrl2: {
      allowNull: true,
      type: DataTypes.STRING
    }, 
    fileUrlTxt2: {
      allowNull: true,
      type: DataTypes.STRING
    },
    tagTitle1: {
      allowNull: true,
      type: DataTypes.STRING
    },
    tagDescription1: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    tagTitle2: {
      allowNull: true,
      type: DataTypes.STRING
    },
    tagDescription2: {
      allowNull: true,
      type: DataTypes.TEXT
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
    modelName: 'PageAbout',
  });
  return PageAbout;
};
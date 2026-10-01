'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PageFeatures extends Model {
    static associate(models) {
      // define association here
      PageFeatures.belongsTo(models.PageMasters, {foreignKey: 'pageId'});
    }
  }
  PageFeatures.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    pageId: DataTypes.INTEGER,
    orderNumber: {
      type: DataTypes.INTEGER,
      defaultValue:1
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    btnText: {
      allowNull: true,
      type: DataTypes.STRING
    },
    btnLink: {
      allowNull: true,
      type: DataTypes.STRING
    },
    remarks: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    fileUrl: {
      allowNull: false,
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
    modelName: 'PageFeatures',
  });
  return PageFeatures;
};
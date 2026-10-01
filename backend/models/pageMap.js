'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PageMaps extends Model {
    static associate(models) {
      // define association here
      PageMaps.belongsTo(models.PageMasters, {foreignKey: 'pageId'});
    }
  }
  PageMaps.init({
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
    subTitle: {
      allowNull: true,
      type: DataTypes.STRING
    },
    remarks: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    fileUrl: {
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
    modelName: 'PageMaps',
  });
  return PageMaps;
};
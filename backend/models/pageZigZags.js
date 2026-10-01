'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PageZigZags extends Model {
    static associate(models) {
      // define association here
      PageZigZags.belongsTo(models.PageMasters, {foreignKey: 'pageId'});
    }
  }
  PageZigZags.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    pageId: DataTypes.INTEGER,
    title: {
      allowNull: true,
      type: DataTypes.STRING
    },
    orderNumber: {
      type: DataTypes.INTEGER,
      defaultValue:1
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
    modelName: 'PageZigZags',
  });
  return PageZigZags;
};
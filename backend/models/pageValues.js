'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PageValues extends Model {
    static associate(models) {
      // define association here
      PageValues.belongsTo(models.PageMasters, {foreignKey: 'pageId'});
    }
  }
  PageValues.init({
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
    remarks: {
      allowNull: false,
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
    modelName: 'PageValues',
  });
  return PageValues;
};
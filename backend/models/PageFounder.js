'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PageFounders extends Model {
    static associate(models) {
      // define association here
      PageFounders.belongsTo(models.PageMasters, {foreignKey: 'pageId'});
    }
  }
  PageFounders.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    pageId: DataTypes.INTEGER,
    name1: {
      allowNull: false,
      type: DataTypes.STRING
    },
    designation1: {
      allowNull: false,
      type: DataTypes.STRING
    },
    fileUrl1: {
      allowNull: false,
      type: DataTypes.STRING
    },
    name2: {
      allowNull: true,
      type: DataTypes.STRING
    },
    designation2: {
      allowNull: true,
      type: DataTypes.STRING
    },
    fileUrl2: {
      allowNull: true,
      type: DataTypes.STRING
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    remarks: {
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
    modelName: 'PageFounders',
  });
  return PageFounders;
};
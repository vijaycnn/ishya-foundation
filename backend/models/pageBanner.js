'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PageBanners extends Model {
    static associate(models) {
      // define association here
      PageBanners.belongsTo(models.PageMasters, {foreignKey: 'pageId'});
    }
  }
  PageBanners.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    pageId: DataTypes.INTEGER,
    type: {
      allowNull: false,
      type: DataTypes.STRING
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
    modelName: 'PageBanners',
  });
  return PageBanners;
};
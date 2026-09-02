'use strict';
const {  Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Faqs extends Model {
    
    static associate(models) {
      // define association here
      Faqs.hasOne(models.FaqCategories, { sourceKey: "categoryId", foreignKey: "id"});
    }
  }
  Faqs.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    categoryId: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    quest: {
      allowNull: false,     
      type: DataTypes.TEXT,
    },
    answer: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    orderNumber:{
      type:DataTypes.INTEGER,
      defaultValue:1
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
    modelName: 'Faqs',
  });
  return Faqs;
};
'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PageTestimonial extends Model {
    static associate(models) {
      // define association here
      PageTestimonial.belongsTo(models.PageMasters, {foreignKey: 'pageId'});
    }
  }
  PageTestimonial.init({
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
    showRecord: {
      allowNull: true,
      type: DataTypes.INTEGER
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
    modelName: 'PageTestimonial',
  });
  return PageTestimonial;
};
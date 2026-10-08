'use strict';
const {  Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blogs extends Model {
    
    static associate(models) {
      // define association here
    }
  }
  Blogs.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    slug: {
      allowNull: false,
      type: DataTypes.STRING
    },
    fileUrl: {
      allowNull: false,
      type: DataTypes.STRING
    },
    remarks: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    publishAt: {
        allowNull: false,
        type: DataTypes.DATE
    },
    publishBy: {
      allowNull: true,     
      type: DataTypes.STRING,
    },
    likeCount:{
      type:DataTypes.INTEGER,
      defaultValue:0
    },
    commentCount:{
      type:DataTypes.INTEGER,
      defaultValue:0
    },
    shareCount:{
      type:DataTypes.INTEGER,
      defaultValue:0
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
    modelName: 'Blogs',
  });
  return Blogs;
};
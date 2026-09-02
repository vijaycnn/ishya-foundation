'use strict';
const {  Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SlideFiles extends Model {
    
    static associate(models) {
      // define association here
    }
  }
  SlideFiles.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    slideNumber: {
      allowNull: false,     
      type: DataTypes.STRING,
    },
    fileUrl: {
      allowNull: false,
      type: DataTypes.STRING
    },
    remark: {
      allowNull: true,
      type: DataTypes.TEXT
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
    modelName: 'SlideFiles',
  });
  return SlideFiles;
};
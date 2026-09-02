'use strict';
const {  Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OneTimeCodes extends Model {
    
    static associate(models) {
      // define association here
    }
  }
  OneTimeCodes.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    phone: {
      allowNull: false,     
      type: DataTypes.STRING,
    },
    otpCode:{
      allowNull: false,     
      type: DataTypes.STRING,
    },
    expiresAt:{
      type: DataTypes.DATE,
      allowNull: false
    },
    verified:{
      type:DataTypes.INTEGER,
      defaultValue:1
    },  //1--Pending,  2-- Verified,    3--Cancelled/Old rows
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE
    },
    updatedAt: {
        allowNull: true,
        type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'OneTimeCodes',
  });
  return OneTimeCodes;
};
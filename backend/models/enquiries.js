'use strict';
const {  Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Enquiries extends Model {
    
    static associate(models) {
      // define association here
      Enquiries.hasOne(models.StateMaster, { sourceKey: "stateId", foreignKey: "id"});
      Enquiries.hasOne(models.CityMaster, { sourceKey: "cityId", foreignKey: "id"});
    }
  }
  Enquiries.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,     
      type: DataTypes.STRING,
    },
    contact: {
      allowNull: true,
      type: DataTypes.STRING
    },
    email: {
      allowNull: true,
      type: DataTypes.STRING
    },
    dob: {
      allowNull: true,     
      type: DataTypes.DATE,
    },
    stateId: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    cityId: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    address: {
      allowNull: true,
      type: DataTypes.STRING
    },
    pincode: {
      allowNull: true,
      type: DataTypes.STRING
    },
    interest_in_role: {
      allowNull: true,
      type: DataTypes.STRING
    },
    other_roles: {
      allowNull: true,
      type: DataTypes.STRING
    },
    story: {
      allowNull: true,
      type: DataTypes.STRING
    },
    dream_remarks: {
      allowNull: true,
      type: DataTypes.STRING
    },
    media_url: {
      allowNull: true,
      type: DataTypes.STRING
    },
    how_to_know_about_this: {
      allowNull: true,
      type: DataTypes.STRING
    },
    i_confim: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    read_tnc: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    agree_tnc: {
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
    updatedAt: {
        allowNull: true,
        type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Enquiries',
  });
  return Enquiries;
};
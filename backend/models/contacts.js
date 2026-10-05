'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contacts extends Model {
    static associate(models) {
      // define association here
    }
  }
  Contacts.init({
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
    mapFileUrl: {
      allowNull: false,
      type: DataTypes.STRING
    },
    contactNumber: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    watsappFileUrl: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING
    },
    addressTitle1: {
      allowNull: false,
      type: DataTypes.STRING
    },
    address1: {
      allowNull: false,
      type: DataTypes.STRING
    },
    location1: {
      allowNull: true,
      type: DataTypes.STRING
    },
    addressTitle2: {
      allowNull: true,
      type: DataTypes.STRING
    },
    address2: {
      allowNull: true,
      type: DataTypes.STRING
    },
    location2: {
      allowNull: true,
      type: DataTypes.STRING
    },
    addressTitle3: {
      allowNull: true,
      type: DataTypes.STRING
    },
    address3: {
      allowNull: true,
      type: DataTypes.STRING
    },
    location3: {
      allowNull: true,
      type: DataTypes.STRING
    },
    formTitle: {
      allowNull: true,
      type: DataTypes.STRING
    },
    formHeading: {
      allowNull: true,
      type: DataTypes.STRING
    },
    formFileUrl: {
      allowNull: false,
      type: DataTypes.STRING
    },
    heading: {
      allowNull: true,
      type: DataTypes.STRING
    },
    faqTitle: {
      allowNull: true,
      type: DataTypes.STRING
    },
    faqHeading: {
      allowNull: true,
      type: DataTypes.STRING
    },
    faqFileUrl: {
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
    modelName: 'Contacts',
  });
  return Contacts;
};
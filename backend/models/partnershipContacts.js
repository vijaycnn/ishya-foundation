'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PartnershipContacts extends Model {
    static associate(models) {
      // define association here
      PartnershipContacts.belongsTo(models.Partnerships, {foreignKey: 'partnershipId'});
    }
  }
  PartnershipContacts.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    partnershipId: DataTypes.INTEGER,
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    link: {
      allowNull: false,
      type: DataTypes.STRING
    },
    remarks: {
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
    modelName: 'PartnershipContacts',
  });
  return PartnershipContacts;
};
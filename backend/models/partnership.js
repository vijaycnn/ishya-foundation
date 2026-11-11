'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Partnerships extends Model {
    static associate(models) {
      // define association here
      Partnerships.hasMany(models.PartnershipBlogs, {foreignKey: 'partnershipId'});
      Partnerships.hasMany(models.PartnershipContacts, {foreignKey: 'partnershipId'});
    }
  }
  Partnerships.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    impactHeading: {
      allowNull: false,
      type: DataTypes.STRING
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    remarks: {
      allowNull: false,
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
    modelName: 'Partnerships',
  });
  return Partnerships;
};
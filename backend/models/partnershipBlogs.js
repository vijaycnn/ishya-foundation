'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PartnershipBlogs extends Model {
    static associate(models) {
      // define association here
      PartnershipBlogs.belongsTo(models.Partnerships, {foreignKey: 'partnershipId'});
    }
  }
  PartnershipBlogs.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    partnershipId: DataTypes.INTEGER,
    orderNumber: {
      type: DataTypes.INTEGER,
      defaultValue:1
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    subTitle: {
      allowNull: true,
      type: DataTypes.STRING
    },
    remarks: {
      allowNull: false,
      type: DataTypes.TEXT
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
    modelName: 'PartnershipBlogs',
  });
  return PartnershipBlogs;
};
'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Programs extends Model {
    static associate(models) {
      // define association here
      Programs.belongsTo(models.ProgramTypes, {foreignKey: 'programTypeId'});
      Programs.hasMany(models.ProgramNeeds, {foreignKey: "programId"});
    //   Programs.belongsTo(models.PageMasters, {foreignKey: 'pageId'});
    }
  }
  Programs.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    programTypeId :{
        allowNull: false,
        type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    shortDesc: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    remarks: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    fileUrl: {
      allowNull: true,
      type: DataTypes.STRING
    },
    impactHeading: {
      allowNull: true,
      type: DataTypes.STRING
    },
    impactTitle: {
      allowNull: true,
      type: DataTypes.STRING
    },
    impactFileUrl: {
      allowNull: true,
      type: DataTypes.STRING
    },
    impactDescription: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    joinTitle: {
      allowNull: true,
      type: DataTypes.STRING
    },
    joinFileUrl: {
      allowNull: true,
      type: DataTypes.STRING
    },
    joinDescription: {
      allowNull: true,
      type: DataTypes.TEXT
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
    modelName: 'Programs',
  });
  return Programs;
};
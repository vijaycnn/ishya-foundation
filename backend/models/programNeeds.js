'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProgramNeeds extends Model {
    static associate(models) {
      // define association here
      ProgramNeeds.belongsTo(models.Programs, {foreignKey: 'programId'});
    }
  }
  ProgramNeeds.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    programId :{
        allowNull: false,
        type: DataTypes.INTEGER
    },
    title: {
      allowNull: true,
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
    modelName: 'ProgramNeeds',
  });
  return ProgramNeeds;
};
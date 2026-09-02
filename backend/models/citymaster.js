'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CityMaster extends Model {
    static associate(models) {
      // define association here
      CityMaster.belongsTo(models.StateMaster, {foreignKey: 'stateId'});
    }
  }
  CityMaster.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    stateId: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'CityMaster',
  });
  return CityMaster;
};
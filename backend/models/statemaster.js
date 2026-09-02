'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StateMaster extends Model {
    static associate(models) {
      // define association here
      StateMaster.hasMany(models.CityMaster, {foreignKey: 'stateId'});
    }
  }
  StateMaster.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    countryId: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'StateMaster',
  });
  return StateMaster;
};
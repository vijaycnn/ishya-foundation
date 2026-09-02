'use strict';
module.exports = (sequelize, DataTypes,Sequelize) => {
  const RestPasswords = sequelize.define('RestPasswords', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
 
    email: {
      allowNull: true,
      type: DataTypes.STRING,
    },
 
    resetPasswordToken: {
      allowNull: true,
      type: DataTypes.TEXT
    },

    resetPasswordExpires: {
      allowNull: true,
      type: DataTypes.DATE
    },
    resetPasswordGenerated: {
      allowNull: true,
      type: DataTypes.DATE
    },
    status: {
         type: DataTypes.INTEGER,
         defaultValue: 1
    },

    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE
    }
  }, {});
  RestPasswords.associate = function(models) {
   
    RestPasswords.belongsTo(models.Users, {foreignKey: 'userId'});       
  };
  return RestPasswords;
};

'use strict';
module.exports = (sequelize, DataTypes,Sequelize) => {
  const Users = sequelize.define('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    userName: {
      allowNull: false,
      type: DataTypes.STRING,
      
    },
    userEmail: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    userMobile: {
      allowNull: false,
      type: DataTypes.STRING,
     
    },
    userPassword: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    status: {
         type: DataTypes.INTEGER,
         defaultValue: 1
    },
    isDeleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
     
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE
    },
    createdBy: {
         allowNull: false,
         type: DataTypes.INTEGER,
         defaultValue: 1
    },
    updatedBy: {
         allowNull: false,
         type: DataTypes.INTEGER,
         defaultValue: 1
    },
    reportingManagerId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        defaultValue: 0
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
  
  }, {});
  Users.associate = function(models) {
           
  };
  return Users;
};

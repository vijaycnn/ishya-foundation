'use strict';
const {Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Notifications extends Model {
        static associate(models) {
            // define association here
        }
    }
    Notifications.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
          },
        stateName: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        stateSlug: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        subjectLine: {
            type: DataTypes.STRING,
        },
        emailTemplate: {
            type: DataTypes.TEXT,
        },
        smsTemplate: {
            type: DataTypes.TEXT,
        },
        smsTemplateId: {
            type: DataTypes.STRING,
        },
        status: {
            allowNull: false,
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        isDeleted: {
            allowNull: false,
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    }, {
        sequelize,
        modelName: 'Notifications',
    });
    return Notifications;
};
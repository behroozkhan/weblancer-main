'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var PublisherPlan = function PublisherPlan(sequelize, DataTypes) {
    var PublisherPlan = sequelize.define('PublisherPlan', {
        id: {
            type: DataTypes.BIGINT,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        boughtDate: {
            type: DataTypes.DATE
        },
        expireTime: {
            type: DataTypes.DATE
        },
        totalPriceOfPlan: {
            type: DataTypes.FLOAT
        },
        totalPayForPlan: {
            type: DataTypes.FLOAT
        },
        upgradedToUpperPlan: {
            type: DataTypes.BOOLEAN
        }
    });

    return PublisherPlan;
};

exports.default = PublisherPlan;
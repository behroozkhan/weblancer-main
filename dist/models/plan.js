'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Plan = function Plan(sequelize, DataTypes) {
    var _sequelize$define;

    var Plan = sequelize.define('Plan', (_sequelize$define = {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        order: {
            type: DataTypes.INTEGER
        },
        name: {
            type: DataTypes.STRING,
            unique: true
        }
    }, _defineProperty(_sequelize$define, 'order', {
        type: DataTypes.INTEGER
    }), _defineProperty(_sequelize$define, 'priceMonthly', {
        type: DataTypes.FLOAT
    }), _defineProperty(_sequelize$define, 'priceYearly', {
        type: DataTypes.FLOAT
    }), _defineProperty(_sequelize$define, 'offPriceMonthly', {
        type: DataTypes.FLOAT
    }), _defineProperty(_sequelize$define, 'offpriceYearly', {
        type: DataTypes.FLOAT
    }), _defineProperty(_sequelize$define, 'description', {
        type: DataTypes.JSON
    }), _defineProperty(_sequelize$define, 'summery', {
        type: DataTypes.STRING
    }), _sequelize$define));

    return Plan;
};

exports.default = Plan;
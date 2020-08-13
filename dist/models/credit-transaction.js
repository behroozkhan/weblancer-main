'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var CreditTransaction = function CreditTransaction(sequelize, DataTypes) {
    var CreditTransaction = sequelize.define('CreditTransaction', {
        id: {
            type: DataTypes.BIGINT,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        amount: {
            type: DataTypes.FLOAT
        },
        useType: {
            type: DataTypes.ENUM,
            values: ['plan', 'payment', 'publisherPayment', 'userPayment', 'other']
        },
        resNum: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.JSON
        }
    });

    return CreditTransaction;
};

exports.default = CreditTransaction;
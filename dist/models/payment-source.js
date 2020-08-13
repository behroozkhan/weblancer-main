'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var PaymentSource = function PaymentSource(sequelize, DataTypes) {
    var PaymentSource = sequelize.define('PaymentSource', {
        id: {
            type: DataTypes.BIGINT,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        gateway: {
            type: DataTypes.ENUM,
            values: ['sep', 'mellat', 'saman', 'zarrinPal', 'pay.ir', 'payping', 'parsian']
        },
        data: {
            type: DataTypes.JSON
        },
        isDefault: {
            type: DataTypes.BOOLEAN
        }
    }, {
        timestamps: true
    });

    return PaymentSource;
};

exports.default = PaymentSource;
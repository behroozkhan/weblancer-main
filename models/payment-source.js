const PaymentSource = (sequelize, DataTypes) => {
    const PaymentSource = sequelize.define('payment_source', {
        id: {
            type: DataTypes.BIGINT,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
        },
        gateway: {
            type:   DataTypes.ENUM,
            values: ['sep', 'mellat', 'saman', 'zarrinPal', 'pay.ir', 'payping', 'parsian'],
        },
        data: {
            type:   DataTypes.JSON
        },
        isDefault: {
            type:   DataTypes.BOOLEAN
        },
    }, {
        timestamps: true
    });
    
    return PaymentSource;
};

export default PaymentSource;
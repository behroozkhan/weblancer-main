const PaymentTransaction = (sequelize, DataTypes) => {
    const PaymentTransaction = sequelize.define('PaymentTransaction', {
        gateway: {
            type:   DataTypes.STRING
        },
        resNum: {
            type:   DataTypes.STRING,
            unique: true,
        },
        amount: {
            type: DataTypes.FLOAT,
        },
        authorType: {
            type:   DataTypes.ENUM,
            values: ['publisher', 'enduser', 'dummy']
        },
        authorId: {
            type:   DataTypes.BIGINT,
        },
        sourceType: {
            type:   DataTypes.ENUM,
            values: ['weblancer', 'publisher', 'dummy']
        },
        sourceId: {
            type:   DataTypes.BIGINT
        },
        weblancerState: {
            type:   DataTypes.ENUM,
            values: ['init', 'userPayment', 'verifying', 'complete', 'error']
        },
        redirectToken: {
            type:   DataTypes.STRING,
        },
        paymentResponse: {
            type:   DataTypes.JSON,
        },
        success: {
            type:   DataTypes.BOOLEAN,
        },
        finalState: {
            type:   DataTypes.STRING,
        },
        message: {
            type:   DataTypes.MESSAGE,
        },
        initData: {
            type:   DataTypes.JSON,
        },
        paymentUrl: {
            type:   DataTypes.STRING,
        },
    });
     
    return PaymentTransaction;
};

export default PaymentTransaction;
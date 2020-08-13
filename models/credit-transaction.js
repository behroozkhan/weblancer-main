const CreditTransaction = (sequelize, DataTypes) => {
    const CreditTransaction = sequelize.define('credit_transaction', {
        id: {
            type: DataTypes.BIGINT,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        amount: {
            type: DataTypes.FLOAT,
        },
        useType: {
            type: DataTypes.ENUM,
            values: ['plan', 'payment', 'publisherPayment', 'userPayment','other']
        },
        resNum: {
            type:   DataTypes.STRING,
        },
        description: {
            type: DataTypes.JSON,
        },
    });
     
    return CreditTransaction;
};

export default CreditTransaction;
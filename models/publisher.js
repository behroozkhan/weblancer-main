import PaymentTransaction from "./transaction.js";

const Publisher = (sequelize, DataTypes) => {
    const Publisher = sequelize.define('Publisher', {
        id: {
            type: DataTypes.BIGINT,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        nationalCode: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 123456
        },
        mobile: {
            type: DataTypes.STRING,
        },
        credit: {
            type: DataTypes.FLOAT,
        },
        minCredit: {
            type: DataTypes.FLOAT,
        },
        paymentSource: {
            type:   DataTypes.ENUM,
            values: ['weblancer', 'publisher'],
            defaultValue: 'weblancer'
        },
        emailVerify: {
            type: DataTypes.BOOLEAN,
        },
        mobileVerify: {
            type: DataTypes.BOOLEAN,
        },
        webhookUrls: {
            type: DataTypes.JSON,
            defaultValue: {}
        },
        personalStyle: {
            type: DataTypes.JSON,
            defaultValue: {}
        },
        customDomains: {
            type: DataTypes.JSON,
            defaultValue: []
        },
        subDomain: {
            type: DataTypes.STRING,
            unique: true,
        },
        hasOwnHostServer: {
            type: DataTypes.BOOLEAN,
        },
        publisherApiKey: {
            type: DataTypes.STRING,
            unique: true,
        }
    }, {
        timestamps: true
    });
    
    return Publisher;
};

export default Publisher;
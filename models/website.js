const Website = (sequelize, DataTypes) => {
    const Website = sequelize.define('website', {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        order: {
            type: DataTypes.INTEGER,
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
        basePriceMonthly: {
            type: DataTypes.FLOAT,
        },
        basePriceYearly: {
            type: DataTypes.FLOAT,
        },
        baseOffPriceMonthly: {
            type: DataTypes.FLOAT,
        },
        baseOffPriceYearly: {
            type: DataTypes.FLOAT,
        },
        priceMonthly: {
            type: DataTypes.FLOAT,
        },
        priceYearly: {
            type: DataTypes.FLOAT,
        },
        offPriceMonthly: {
            type: DataTypes.FLOAT,
        },
        offpriceYearly: {
            type: DataTypes.FLOAT,
        },
        description: {
            type: DataTypes.JSON,
        },
        summery: {
            type: DataTypes.STRING,
        },
        resourceMax: {
            type: DataTypes.JSON,
        },
        planType: {
            type: DataTypes.ENUM,
            values: ['resource', 'permission']
        }
    });
     
    return Website;
};

export default Website;
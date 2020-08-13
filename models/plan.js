const Plan = (sequelize, DataTypes) => {
    const Plan = sequelize.define('Plan', {
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
        order: {
            type: DataTypes.INTEGER,
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
    });
     
    return Plan;
};

export default Plan;
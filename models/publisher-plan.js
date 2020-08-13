const PublisherPlan = (sequelize, DataTypes) => {
    const PublisherPlan = sequelize.define('PublisherPlan', {
        id: {
            type: DataTypes.BIGINT,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        boughtDate: {
            type: DataTypes.DATE,
        },
        expireTime: {
            type: DataTypes.DATE,
        },
        totalPriceOfPlan: {
            type: DataTypes.FLOAT,
        },
        totalPayForPlan: {
            type: DataTypes.FLOAT,
        },
        upgradedToUpperPlan: {
            type: DataTypes.BOOLEAN,
        }
    });
     
    return PublisherPlan;
};

export default PublisherPlan;
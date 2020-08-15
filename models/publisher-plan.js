const PublisherPlan = (sequelize, DataTypes) => {
    const PublisherPlan = sequelize.define('publisher_plan', {
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

    PublisherPlan.associate = function(models) {
        models.publisher_plan.belongsTo (models.plan);
    };
     
    return PublisherPlan;
};

module.exports = PublisherPlan;
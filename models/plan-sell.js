const PlanSell = (sequelize, DataTypes) => {
    const PlanSell = sequelize.define('plan_sell', {
        id: {
            type: DataTypes.BIGINT,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        planObject: {
            type: DataTypes.JSON
        },
        websitePlanObject: {
            type: DataTypes.JSON
        },
        planId: {
            type: DataTypes.INTEGER,
            unique: "IX_publisherId_publisherWebsiteId_planId_dayString_isTrial"
        },
        boughtDate: {
            type: DataTypes.DATE,
        },
        startDate: {
            type: DataTypes.DATE,
        },
        expireDate: {
            type: DataTypes.DATE,
        },
        upgradeDate: {
            type: DataTypes.DATE,
        },
        dayString: {
            type: DataTypes.STRING,
            unique: "IX_publisherId_publisherWebsiteId_planId_dayString_isTrial"
        },
        isTrial: {
            type: DataTypes.BOOLEAN,
            unique: "IX_publisherId_publisherWebsiteId_planId_dayString_isTrial"
        },
        publisherId: {
            type: DataTypes.BIGINT,
            unique: "IX_publisherId_publisherWebsiteId_planId_dayString_isTrial"
        },
        publisherWebsiteId: {
            type: DataTypes.BIGINT,
            unique: "IX_publisherId_publisherWebsiteId_planId_dayString_isTrial"
        },
    });

    PlanSell.associate = function(models) {
        models.publisher.hasMany(models.plan_sell);
        models.plan_sell.belongsTo(models.publisher);

        models.publisher_website.hasMany(models.plan_sell);
        models.plan_sell.belongsTo(models.publisher_website);
    }
    
    return PlanSell;
};

module.exports = PlanSell;
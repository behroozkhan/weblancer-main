const PublisherWebsite = (sequelize, DataTypes) => {
    const PublisherWebsite = sequelize.define('publisher_website', {
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
        },
        extended: {
            type: DataTypes.BOOLEAN,
        },
        planOrder: {
            type: DataTypes.INTEGER,
        },
        resource: {
            type: DataTypes.JSON,
        },
        endUserId: {
            type: DataTypes.STRING
        },
        endWebsiteId: {
            type: DataTypes.STRING
        },
        metadata: {
            type: DataTypes.JSON,
        },
        type: {
            type:   DataTypes.ENUM,
            values: ['website', 'service', 'app', 'component'],
        },
    });
     
    return PublisherWebsite;
};

export default PublisherWebsite;
const PublisherWebsite = (sequelize, DataTypes) => {
    const PublisherWebsite = sequelize.define('publisher_website', {
        id: {
            type: DataTypes.BIGINT,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
        },
        displayName: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.JSON,
        },
        serverIpAddress: {
            type: DataTypes.STRING
        },
        url: {
            type: DataTypes.STRING
        },
        metadata: {
            type: DataTypes.JSON,
        },
        type: {
            type:   DataTypes.ENUM,
            values: ['website', 'service', 'app', 'component'],
        },
        endUserId: {
            type: DataTypes.STRING
        },
        endWebsiteId: {
            type: DataTypes.STRING
        },
        data: {
            type: DataTypes.JSONB,
            defaultValue: {}
        },
    }, {
        indexes: [
            {
                unique: true,
                fields: ['name', 'endUserId', 'publisherId']
            }
        ]
    });
     
    return PublisherWebsite;
};

module.exports = PublisherWebsite;
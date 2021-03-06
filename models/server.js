const Server = (sequelize, DataTypes) => {
    const Server = sequelize.define('server', {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
        ipAddress: {
            type: DataTypes.STRING
        },
        sudoPassword: {
            type: DataTypes.STRING
        },
        url: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.ENUM,
            values: ['publisher', 'editor', 'hoster']
        },
        ownerType: {
            type: DataTypes.ENUM,
            values: ['weblancer', 'publisher']
        },
        cpuUsage: {
            type: DataTypes.FLOAT
        },
        memoryUsage: {
            type: DataTypes.FLOAT
        },
        storageUsage: {
            type: DataTypes.FLOAT
        },
        count: {
            type: DataTypes.INTEGER
        },
        timezone: {
            type: DataTypes.TIME
        },
        metadata: {
            type: DataTypes.JSON,
            defaultValue: {}
        },
    });
     
    return Server;
};

module.exports = Server;
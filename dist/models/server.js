'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getLowerServer = getLowerServer;
var Server = function Server(sequelize, DataTypes) {
    var Server = sequelize.define('Server', {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true
        },
        ipAddress: {
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
        }
    });

    return Server;
};

function getLowerServer(type) {
    // TODO return lower server uage by type
}

exports.default = Server;
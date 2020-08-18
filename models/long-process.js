let Sequelize = require('sequelize');

const LongProcess = (sequelize, DataTypes) => {
    const LongProcess = sequelize.define('long_process', {
        id: {
            type: DataTypes.BIGINT,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        metaData: {
            type: DataTypes.JSON,
            defaultValue: {}
        },
        name: {
            type: DataTypes.STRING,
        },
        refId: {
            type: DataTypes.STRING,
        },
        startDate: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW
        },
        endDate: {
            type: DataTypes.DATE,
        },
        status: { // Current message
            type: DataTypes.STRING,
            defaultValue: ""
        },
        message: { // All status appended
            type: DataTypes.STRING,
            defaultValue: ""
        },
        state: {
            type: DataTypes.ENUM,
            values: ['called', 'running', 'complete', 'failed']
        },
        timeout: {
            type: DataTypes.FLOAT,
            defaultValue: 3600
        }
    });
     
    return LongProcess;
};

module.exports = LongProcess;
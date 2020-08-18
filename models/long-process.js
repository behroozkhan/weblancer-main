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
        },
        name: {
            type: DataTypes.STRING,
        },
        refId: {
            type: DataTypes.STRING,
        },
        startDate: {
            type: DataTypes.DATE,
        },
        endDate: {
            type: DataTypes.DATE,
        },
        status: { // Current message
            type: DataTypes.STRING,
        },
        message: { // All status appended
            type: DataTypes.STRING,
        },
        state: {
            type: DataTypes.ENUM,
            values: ['called', 'running', 'complete', 'failed']
        },
        timeout: {
            type: DataTypes.FLOAT
        }
    });
     
    return LongProcess;
};

module.exports = LongProcess;
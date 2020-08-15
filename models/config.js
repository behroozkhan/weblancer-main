let models = require('../model-manager/models.js');

const Config = (sequelize, DataTypes) => {
    const Config = sequelize.define('config', {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        key: {
            type: DataTypes.STRING,
            unique: true,
        },
        value: {
            type: DataTypes.JSON,
        }
    });
     
    return Config;
};

module.exports = Config;

module.exports.getConfig = async function getConfig (key) {
    try {
        return await models.Config.findOne({
            where: {
                key: key
            }
        });
    } catch (e) {
    }
}
import models from './models.js';

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

export async function getConfig (key) {
    try {
        return await models.Config.findOne({
            where: {
                key: key
            }
        }).toJSON();
    } catch (e) {
    }
}

export default Config;
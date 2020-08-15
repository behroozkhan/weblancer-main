import Sequelize from 'sequelize';
import models, {sequelize} from './models.js';
// import configJson from '../config/config.json';

const env = process.env.NODE_ENV || 'development';
// const config = require('../config/config.json')[env];
// const config = configJson[env];
const config = {
  "username": "postgres",
  "password": "Kian880414",
  "database": "WeblancerMain",
  "host": "185.239.107.18:5432",
  "dialect": "postgres"
}
const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js') &&
//     (file !== 'models.js');
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//   });

for (let model in models) {
    if (models.hasOwnProperty(model)) {
      db[model.name] = models[model];
    }
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export {sequelize, Sequelize}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
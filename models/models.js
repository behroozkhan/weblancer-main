<<<<<<< HEAD
import Sequelize from 'sequelize';
import Publisher from './publisher.js';
import PaymentTransaction from './payment-transaction.js';
import Plan from './plan.js';
import Server from './server.js';
import Config from './config.js';
import PublisherPlan from './publisher-plan.js';
import CreditTransaction from './credit-transaction.js';
import Website from './website.js';
import PublisherWebsite from './publisher-website.js';
import PaymentSource from './payment-source.js';
import Response from './../utils/response.js';
=======
let Sequelize = require('sequelize');
let Publisher = require('./publisher.js');
let PaymentTransaction = require('./payment-transaction.js');
let Plan = require('./plan.js');
let Server = require('./server.js');
let Config = require('./config.js');
let PublisherPlan = require('./publisher-plan.js');
let CreditTransaction = require('./credit-transaction.js');
let Website = require('./website.js');
let PublisherWebsite = require('./publisher-website.js');
let PaymentSource = require('./payment-source.js');
const Response = require('../utils/response.js');
>>>>>>> a833008c613929c62b59e620b708864b9f21bb00

const {DataTypes} = Sequelize;
 
const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        dialect: 'postgres',
        logging: (...msg) => console.log(msg),
    },
);

const models = {
    Publisher: Publisher(sequelize, DataTypes),
    PaymentTransaction: PaymentTransaction(sequelize, DataTypes),
    Plan: Plan(sequelize, DataTypes),
    Server: Server(sequelize, DataTypes),
    Config: Config(sequelize, DataTypes),
    PublisherPlan: PublisherPlan(sequelize, DataTypes),
    CreditTransaction: CreditTransaction(sequelize, DataTypes),
    Website: Website(sequelize, DataTypes),
    PublisherWebSite: PublisherWebsite(sequelize, DataTypes),
    PaymentSource: PaymentSource(sequelize, DataTypes),
};

models.Publisher.hasMany(models.PaymentTransaction);
models.Publisher.hasMany(models.CreditTransaction);
models.PublisherPlan.belongsTo(models.Publisher);
models.PublisherPlan.belongsTo (models.Plan);
models.Publisher.hasMany(models.PublisherWebSite);
models.PublisherWebSite.hasMany(models.Website);
models.Publisher.hasOne(models.Server, {as: 'mainServer', foreignKey: 'mainServerId'});
models.Publisher.hasMany(models.Server, {as: 'hostServers'});

models.Publisher.hasMany(models.PaymentSource);
models.PaymentSource.belongsTo(models.Publisher);

let findAndCountAll = (req, res, model) => {
    let pageNumber = req.query.pageNumber || 1;
    let rowPerPage = req.query.rowPerPage || 10;
    let orderParam = req.query.orderParam || "createdAt";
    model.findAndCountAll({
        order: [[orderParam, 'DESC']],
        limit: pageNumber,
        offset: (pageNumber - 1) * rowPerPage,
    }).then(function (result) {
        res.json(
            new Response(true, {
                rows: result.rows, 
                count: result.count,
                pageNumber,
                rowPerPage,
                orderParam
            }).json()
        );
    }).catch(error => {
        res.status(500).json(
            new Response(false, {}, error.message).json()
        );
    });
}

module.exports = models;
module.exports.sequelize = sequelize;
module.exports.findAndCountAll = findAndCountAll;
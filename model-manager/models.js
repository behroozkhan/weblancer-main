let Sequelize = require('sequelize');
let Publisher = require('../models/publisher.js');
let PaymentTransaction = require('../models/payment-transaction.js');
let Plan = require('../models/plan.js');
let Config = require('../models/config.js');
let Server = require('../models/server.js');
let PublisherPlan = require('../models/publisher-plan.js');
let CreditTransaction = require('../models/credit-transaction.js');
let Website = require('../models/website.js');
let PublisherWebsite = require('../models/publisher-website.js');
let PaymentSource = require('../models/payment-source.js');
const Response = require('../utils/response.js');

const {DataTypes} = Sequelize;

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        dialect: 'postgres',
        logging: (...msg) => console.log(msg),
        host: "185.239.107.18"
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

// models.Publisher.hasMany(models.PaymentTransaction);
// models.Publisher.hasMany(models.CreditTransaction);
// models.PublisherPlan.belongsTo(models.Publisher);
// models.PublisherPlan.belongsTo (models.Plan);
// models.Publisher.hasMany(models.PublisherWebSite);
// models.PublisherWebSite.hasMany(models.Website);
// models.Publisher.hasOne(models.Server, {as: 'mainServer', foreignKey: 'mainServerId'});
// models.Publisher.hasMany(models.Server, {as: 'hostServers'});
// models.Publisher.hasMany(models.PaymentSource);
// models.PaymentSource.belongsTo(models.Publisher);

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

module.exports.models = models;
module.exports.sequelize = sequelize;
module.exports.findAndCountAll = findAndCountAll;
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
module.exports.getLowerServer = function getLowerServer (type) {
    // TODO return lower server uage by type
}

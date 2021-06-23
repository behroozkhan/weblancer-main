require('pg').defaults.parseInt8 = true
let Sequelize = require('sequelize');
let Publisher = require('../models/publisher.js');
let PaymentTransaction = require('../models/payment-transaction.js');
let Plan = require('../models/plan.js');
let Config = require('../models/config.js');
let Server = require('../models/server.js');
let PublisherPlan = require('../models/publisher-plan.js');
let CreditTransaction = require('../models/credit-transaction.js');
let PublisherWebsite = require('../models/publisher-website.js');
let PaymentSource = require('../models/payment-source.js');
let Product = require('../models/product.js');
let ProductSell = require('../models/product-sell.js');
let PlanSell = require('../models/plan-sell.js');
const Response = require('../utils/response.js');
const LongProcess = require('../models/long-process.js');

const {DataTypes} = Sequelize;

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        dialect: 'postgres',
        host: process.env.DATABASE_ADDRESS,
        dialectOptions: {
            supportBigNumbers: true
        },
        logging: false
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
    PublisherWebSite: PublisherWebsite(sequelize, DataTypes),
    PaymentSource: PaymentSource(sequelize, DataTypes),
    LongProcess: LongProcess(sequelize, DataTypes),
    Product: Product(sequelize, DataTypes),
    ProductSell: ProductSell(sequelize, DataTypes),
    PlanSell: PlanSell(sequelize, DataTypes),
};

let allModels = {};
Object.values(models).forEach(model => {
    allModels[model.name] = model;
});

Object.values(models).forEach(model => {
    if (model.associate)
        model.associate(allModels);
});

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
        let data = await models.Config.findOne({
            where: {
                key: key
            }
        });

        if (data) {
            console.log("Config: ", data.toJSON());
            return data.toJSON().value;
        } else {
            return {};
        }
    } catch (e) {
    }
}
module.exports.getLowerServer = function getLowerServer (type) {
    // TODO return lower server uage by type
}
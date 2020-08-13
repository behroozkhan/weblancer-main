'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.findAndCountAll = exports.sequelize = undefined;

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _publisher = require('./publisher.js');

var _publisher2 = _interopRequireDefault(_publisher);

var _paymentTransaction = require('./payment-transaction.js');

var _paymentTransaction2 = _interopRequireDefault(_paymentTransaction);

var _plan = require('./plan.js');

var _plan2 = _interopRequireDefault(_plan);

var _server = require('./server.js');

var _server2 = _interopRequireDefault(_server);

var _config = require('./config.js');

var _config2 = _interopRequireDefault(_config);

var _publisherPlan = require('./publisher-plan.js');

var _publisherPlan2 = _interopRequireDefault(_publisherPlan);

var _creditTransaction = require('./credit-transaction.js');

var _creditTransaction2 = _interopRequireDefault(_creditTransaction);

var _website = require('./website.js');

var _website2 = _interopRequireDefault(_website);

var _publisherWebsite = require('./publisher-website.js');

var _publisherWebsite2 = _interopRequireDefault(_publisherWebsite);

var _paymentSource = require('./payment-source.js');

var _paymentSource2 = _interopRequireDefault(_paymentSource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DataTypes = _sequelize2.default.DataTypes;


var sequelize = new _sequelize2.default(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    dialect: 'postgres'
});

var models = {
    Publisher: (0, _publisher2.default)(sequelize, DataTypes),
    PaymentTransaction: (0, _paymentTransaction2.default)(sequelize, DataTypes),
    Plan: (0, _plan2.default)(sequelize, DataTypes),
    Server: (0, _server2.default)(sequelize, DataTypes),
    Config: (0, _config2.default)(sequelize, DataTypes),
    PublisherPlan: (0, _publisherPlan2.default)(sequelize, DataTypes),
    CreditTransaction: (0, _creditTransaction2.default)(sequelize, DataTypes),
    Website: (0, _website2.default)(sequelize, DataTypes),
    PublisherWebSite: (0, _publisherWebsite2.default)(sequelize, DataTypes),
    PaymentSource: (0, _paymentSource2.default)(sequelize, DataTypes)
};

models.Publisher.hasMany(models.PaymentTransaction);
models.Publisher.hasMany(models.CreditTransaction);
models.Publisher.hasOne(models.PublisherPlan);
models.PublisherPlan.hasOne(models.Plan);
models.Publisher.hasMany(models.PublisherWebSite);
models.PublisherWebSite.hasMany(models.Website);
models.Publisher.hasOne(models.Server, { as: 'mainServer', foreignKey: 'mainServerId' });
models.Publisher.hasMany(models.Server, { as: 'hostServers' });

models.Publisher.hasMany(models.PaymentSource);
models.PaymentSource.belongsTo(models.Publisher);

var findAndCountAll = function findAndCountAll(req, res, model) {
    var pageNumber = req.query.pageNumber || 1;
    var rowPerPage = req.query.rowPerPage || 10;
    var orderParam = req.query.orderParam || "createdAt";
    model.findAndCountAll({
        order: [[orderParam, 'DESC']],
        limit: pageNumber,
        offset: (pageNumber - 1) * rowPerPage
    }).then(function (result) {
        res.json(new Response(true, {
            rows: result.rows,
            count: result.count,
            pageNumber: pageNumber,
            rowPerPage: rowPerPage,
            orderParam: orderParam
        }).json());
    }).catch(function (error) {
        res.status(500).json(new Response(false, {}, error.message).json());
    });
};

exports.sequelize = sequelize;
exports.findAndCountAll = findAndCountAll;
exports.default = models;
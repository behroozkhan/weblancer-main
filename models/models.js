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
import umzug from 'umzug';

const { Umzug, SequelizeStorage } = umzug;

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

const umzug = new Umzug({
    migrations: {
        path: './migrations',
        params: [
            sequelize.getQueryInterface()
        ]
    },
    storage: new SequelizeStorage({ sequelize })
});

(async () => {
    // Checks migrations and run them if they are not already applied. To keep
    // track of the executed migrations, a table (and sequelize model) called SequelizeMeta
    // will be automatically created (if it doesn't exist already) and parsed.
    await umzug.up();
})();

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

export { sequelize };
export { findAndCountAll };

export default models;
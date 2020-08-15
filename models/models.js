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
import umzugPkg from 'umzug';
import path from 'path';

const __dirname = path.resolve();

const { Umzug } = umzugPkg;

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
      // indicates the folder containing the migration .js files
      path: path.join(__dirname, './migrations'),
      // inject sequelize's QueryInterface in the migrations
      params: [
        sequelize.getQueryInterface()
      ]
    },
    // indicates that the migration data should be store in the database
    // itself through sequelize. The default configuration creates a table
    // named `SequelizeMeta`.
    storage: 'sequelize',
    storageOptions: {
      sequelize: sequelize
    }
  })
   
  ;(async () => {
    // checks migrations and run them if they are not already applied
    await umzug.up()
    console.log('All migrations performed successfully')
  })()

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
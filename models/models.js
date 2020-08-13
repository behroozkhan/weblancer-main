import Sequelize from 'sequelize';
 
const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        dialect: 'postgres',
    },
);

console.log("Here1");

const models = {
    Publisher: sequelize.import('./publisher.js'),
    PaymentTransaction: sequelize.import('./payment-transaction.js'),
    Plan: sequelize.import('./plan.js'),
    Server: sequelize.import('./server.js'),
    Config: sequelize.import('./config.js'),
    PublisherPlan: sequelize.import('./publisher-plan.js'),
    CreditTransaction: sequelize.import('./credit-transaction.js'),
    Website: sequelize.import('./website.js'),
    PublisherWebSite: sequelize.import('./publisher-webSite.js'),
    PaymentSource: sequelize.import('./payment-source.js'),
};
console.log("Here2");

models.Publisher.hasMany(models.PaymentTransaction);
models.Publisher.hasMany(models.CreditTransaction);
models.Publisher.hasOne(models.PublisherPlan);
models.PublisherPlan.hasOne(models.Plan);
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

export { sequelize };
export { findAndCountAll };

export default models;
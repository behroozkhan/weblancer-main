const PublisherWebsite = (sequelize, DataTypes) => {
    const PublisherWebsite = sequelize.define('publisher_website', {
        id: {
            type: DataTypes.BIGINT,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
        description: {
            type: DataTypes.JSON,
        },
        boughtDate: {
            type: DataTypes.DATE,
        },
        planOrder: {
            type: DataTypes.INTEGER,
        },
        planStartDate: {
            type: DataTypes.DATE,
        },
        expireTime: {
            type: DataTypes.DATE,
        },
        metadata: {
            type: DataTypes.JSON,
        },
        type: {
            type:   DataTypes.ENUM,
            values: ['website', 'service', 'app', 'component'],
        },
        endUserId: {
            type: DataTypes.STRING
        },
        endWebsiteId: {
            type: DataTypes.STRING
        },
        totalPriceOfPlan: { // base on products
            type: DataTypes.FLOAT,
        },
        totalPayForPlan: { // publisher get from end user
            type: DataTypes.FLOAT,
        },
        productsDetail: { // base plan products
            type: DataTypes.JSON,
        },
        addedProducts: { // upgraded or added products with in plan priod
            type: DataTypes.JSON,
        },
        addedPrice: { // upgraded or added products price with in plan priod
            type: DataTypes.FLOAT,
        },
        totalPrice: {
            type: DataTypes.FLOAT,
        },
        totalPayment: {
            type: DataTypes.FLOAT,
        }
    });
     
    return PublisherWebsite;
};

module.exports = PublisherWebsite;
const ProductSell = (sequelize, DataTypes) => {
    const ProductSell = sequelize.define('product_sell', {
        id: {
            type: DataTypes.BIGINT,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        productId: {
            type: DataTypes.INTEGER,
            unique: "IX_productId_publisherId_publisherWebsiteId_planId_dayString"
        },
        isTrial: {
            type: DataTypes.BOOLEAN
        },
        sellPrice: {
            type: DataTypes.FLOAT
        },
        publisherId: {
            type: DataTypes.BIGINT,
            unique: "IX_productId_publisherId_publisherWebsiteId_planId_dayString"
        },
        planId: {
            type: DataTypes.INTEGER,
            unique: "IX_productId_publisherId_publisherWebsiteId_planId_dayString"
        },
        dayString: {
            type: DataTypes.STRING,
            unique: "IX_productId_publisherId_publisherWebsiteId_planId_dayString"
        },
        publisherWebsiteId: {
            type: DataTypes.BIGINT,
            unique: "IX_productId_publisherId_publisherWebsiteId_planId_dayString"
        },
        boughtDate: {
            type: DataTypes.DATE,
        },
        moneyBackDays: {
            type: DataTypes.INTEGER,
            defaultValue: 14
        },
        moneyBacked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        planTime: {
            type: DataTypes.STRING,
        },
        metadata: {
            type: DataTypes.JSON,
        },
    });

    ProductSell.associate = function(models) {
        models.product.hasMany(models.product_sell);
        models.product_sell.belongsTo(models.product);

        models.publisher.hasMany(models.product_sell);
        models.product_sell.belongsTo(models.publisher);

        models.publisher_website.hasMany(models.product_sell);
        models.product_sell.belongsTo(models.publisher_website);
    }
    
    return ProductSell;
};

module.exports = ProductSell;
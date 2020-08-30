const Product = (sequelize, DataTypes) => {
    const Product = sequelize.define('product', {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        order: {
            type: DataTypes.INTEGER,
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
        },
        help: {
            type: DataTypes.TEXT,
        },
        priceMonthly: {
            type: DataTypes.FLOAT,
        },
        priceYearly: {
            type: DataTypes.FLOAT,
        },
        offPriceMonthly: {
            type: DataTypes.FLOAT,
        },
        offpriceYearly: {
            type: DataTypes.FLOAT,
        },
        type: {
            type: DataTypes.ENUM,
            values: ['resource', 'service', 'limitation', 'app', 'component', 'vps']
        },
        bindType: {
            type: DataTypes.ENUM,
            values: ['acount', 'good', 'website']
        },
        max: {
            type: DataTypes.INTEGER,
        },
        requiredProductId: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
        },
        requiredWebsiteType: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },
    });
     
    return Product;
};

module.exports = Product;
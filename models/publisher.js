const Publisher = (sequelize, DataTypes) => {
    const Publisher = sequelize.define('publisher', {
        id: {
            type: DataTypes.BIGINT,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        brandName: {
            type: DataTypes.STRING,
        },
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        nationalCode: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 123456
        },
        mobile: {
            type: DataTypes.STRING,
        },
        credit: {
            type: DataTypes.FLOAT,
        },
        minCredit: {
            type: DataTypes.FLOAT,
        },
        role: {
            type:   DataTypes.ENUM,
            values: ['weblancer', 'publisher', 'admin', 'user'],
            defaultValue: 'publisher'
        },
        paymentSource: {
            type:   DataTypes.ENUM,
            values: ['weblancer', 'publisher'],
            defaultValue: 'weblancer'
        },
        emailVerify: {
            type: DataTypes.BOOLEAN,
        },
        mobileVerify: {
            type: DataTypes.BOOLEAN,
        },
        webhookUrls: {
            type: DataTypes.JSON,
            defaultValue: {}
        },
        personalStyle: {
            type: DataTypes.JSON,
            defaultValue: {}
        },
        customDomains: {
            type: DataTypes.JSON,
            defaultValue: []
        },
        hasOwnHostServer: {
            type: DataTypes.BOOLEAN,
        },
        publisherApiKey: {
            type: DataTypes.STRING,
            unique: true,
        },
        publisherVersion: {
            type: DataTypes.FLOAT,
        },
        expressPort: {
            type: DataTypes.INTEGER,
        },
    }, {
        timestamps: true
    });

    Publisher.associate = function(models) {
        models.publisher.hasMany(models.payment_transaction);
        models.publisher.hasMany(models.credit_transaction);
        models.publisher_plan.belongsTo(models.publisher);
        models.publisher.hasMany(models.publisher_website);
        models.publisher.hasOne(models.server, {as: 'mainServer', foreignKey: 'mainServerId'});
        models.publisher.hasMany(models.server, {as: 'hostServers'});
        models.publisher.hasMany(models.payment_source);
        models.payment_source.belongsTo(models.publisher);
        models.publisher.hasMany(models.long_process, { as: "longProcesses" });
        models.long_process.belongsTo(models.publisher, {
            foreignKey: "publisherId",
            as: "publisher",
        });
    };
    
    return Publisher;
};

module.exports = Publisher;
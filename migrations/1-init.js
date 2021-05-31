'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "configs", deps: []
 * createTable "plans", deps: []
 * createTable "products", deps: []
 * createTable "publishers", deps: []
 * createTable "credit_transactions", deps: [publishers]
 * createTable "long_processes", deps: [publishers]
 * createTable "payment_sources", deps: [publishers]
 * createTable "payment_transactions", deps: [publishers]
 * createTable "publisher_websites", deps: [publishers]
 * createTable "plan_sells", deps: [publishers, publisher_websites]
 * createTable "publisher_plans", deps: [plans, publishers]
 * createTable "product_sells", deps: [products, publishers, publisher_websites]
 * createTable "servers", deps: [publishers, publishers]
 * addIndex "publisher_websites_name_end_user_id_publisher_id" to table "publisher_websites"
 *
 **/

var info = {
    "revision": 1,
    "name": "init",
    "created": "2021-05-31T01:53:06.966Z",
    "comment": ""
};

var migrationCommands = function(transaction) {
    return [{
            fn: "createTable",
            params: [
                "configs",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "primaryKey": true,
                        "autoIncrement": true,
                        "unique": true
                    },
                    "key": {
                        "type": Sequelize.STRING,
                        "field": "key",
                        "unique": true
                    },
                    "value": {
                        "type": Sequelize.JSON,
                        "field": "value"
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "plans",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "primaryKey": true,
                        "autoIncrement": true,
                        "unique": true
                    },
                    "order": {
                        "type": Sequelize.INTEGER,
                        "field": "order"
                    },
                    "name": {
                        "type": Sequelize.STRING,
                        "field": "name",
                        "unique": true
                    },
                    "priceMonthly": {
                        "type": Sequelize.FLOAT,
                        "field": "priceMonthly"
                    },
                    "priceYearly": {
                        "type": Sequelize.FLOAT,
                        "field": "priceYearly"
                    },
                    "offPriceMonthly": {
                        "type": Sequelize.FLOAT,
                        "field": "offPriceMonthly"
                    },
                    "offpriceYearly": {
                        "type": Sequelize.FLOAT,
                        "field": "offpriceYearly"
                    },
                    "description": {
                        "type": Sequelize.JSON,
                        "field": "description"
                    },
                    "summery": {
                        "type": Sequelize.STRING,
                        "field": "summery"
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "products",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "primaryKey": true,
                        "autoIncrement": true,
                        "unique": true
                    },
                    "order": {
                        "type": Sequelize.INTEGER,
                        "field": "order"
                    },
                    "name": {
                        "type": Sequelize.STRING,
                        "field": "name",
                        "unique": true
                    },
                    "description": {
                        "type": Sequelize.TEXT,
                        "field": "description"
                    },
                    "help": {
                        "type": Sequelize.TEXT,
                        "field": "help"
                    },
                    "priceMonthly": {
                        "type": Sequelize.FLOAT,
                        "field": "priceMonthly"
                    },
                    "priceYearly": {
                        "type": Sequelize.FLOAT,
                        "field": "priceYearly"
                    },
                    "offPriceMonthly": {
                        "type": Sequelize.FLOAT,
                        "field": "offPriceMonthly"
                    },
                    "offpriceYearly": {
                        "type": Sequelize.FLOAT,
                        "field": "offpriceYearly"
                    },
                    "type": {
                        "type": Sequelize.ENUM('resource', 'service', 'limitation', 'app', 'component', 'vps'),
                        "field": "type"
                    },
                    "bindTo": {
                        "type": Sequelize.ENUM('acount', 'product', 'website'),
                        "field": "bindTo"
                    },
                    "max": {
                        "type": Sequelize.INTEGER,
                        "field": "max"
                    },
                    "requiredProductId": {
                        "type": Sequelize.ARRAY(Sequelize.INTEGER),
                        "field": "requiredProductId"
                    },
                    "requiredWebsiteType": {
                        "type": Sequelize.ARRAY(Sequelize.STRING),
                        "field": "requiredWebsiteType"
                    },
                    "metadata": {
                        "type": Sequelize.JSON,
                        "field": "metadata"
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "publishers",
                {
                    "id": {
                        "type": Sequelize.BIGINT,
                        "field": "id",
                        "primaryKey": true,
                        "autoIncrement": true,
                        "unique": true
                    },
                    "username": {
                        "type": Sequelize.STRING,
                        "field": "username",
                        "unique": true,
                        "allowNull": false
                    },
                    "brandName": {
                        "type": Sequelize.STRING,
                        "field": "brandName"
                    },
                    "firstName": {
                        "type": Sequelize.STRING,
                        "field": "firstName"
                    },
                    "lastName": {
                        "type": Sequelize.STRING,
                        "field": "lastName"
                    },
                    "nationalCode": {
                        "type": Sequelize.STRING,
                        "field": "nationalCode"
                    },
                    "email": {
                        "type": Sequelize.STRING,
                        "field": "email"
                    },
                    "password": {
                        "type": Sequelize.STRING,
                        "field": "password",
                        "defaultValue": 123456,
                        "allowNull": false
                    },
                    "mobile": {
                        "type": Sequelize.STRING,
                        "field": "mobile"
                    },
                    "credit": {
                        "type": Sequelize.FLOAT,
                        "field": "credit"
                    },
                    "minCredit": {
                        "type": Sequelize.FLOAT,
                        "field": "minCredit"
                    },
                    "role": {
                        "type": Sequelize.ENUM('weblancer', 'publisher', 'admin', 'user'),
                        "field": "role",
                        "defaultValue": "publisher"
                    },
                    "paymentSource": {
                        "type": Sequelize.ENUM('weblancer', 'publisher'),
                        "field": "paymentSource",
                        "defaultValue": "weblancer"
                    },
                    "emailVerify": {
                        "type": Sequelize.BOOLEAN,
                        "field": "emailVerify"
                    },
                    "mobileVerify": {
                        "type": Sequelize.BOOLEAN,
                        "field": "mobileVerify"
                    },
                    "webhookUrls": {
                        "type": Sequelize.JSON,
                        "field": "webhookUrls",
                        "defaultValue": Sequelize.Object
                    },
                    "personalStyle": {
                        "type": Sequelize.JSON,
                        "field": "personalStyle",
                        "defaultValue": Sequelize.Object
                    },
                    "customDomains": {
                        "type": Sequelize.JSON,
                        "field": "customDomains",
                        "defaultValue": Sequelize.Array
                    },
                    "publisherWebsiteDomain": {
                        "type": Sequelize.STRING,
                        "field": "publisherWebsiteDomain"
                    },
                    "hasOwnHostServer": {
                        "type": Sequelize.BOOLEAN,
                        "field": "hasOwnHostServer"
                    },
                    "publisherApiKey": {
                        "type": Sequelize.STRING,
                        "field": "publisherApiKey",
                        "unique": true
                    },
                    "publisherVersion": {
                        "type": Sequelize.FLOAT,
                        "field": "publisherVersion"
                    },
                    "expressPort": {
                        "type": Sequelize.INTEGER,
                        "field": "expressPort"
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "credit_transactions",
                {
                    "id": {
                        "type": Sequelize.BIGINT,
                        "field": "id",
                        "primaryKey": true,
                        "autoIncrement": true,
                        "unique": true
                    },
                    "amount": {
                        "type": Sequelize.FLOAT,
                        "field": "amount"
                    },
                    "useType": {
                        "type": Sequelize.ENUM('plan', 'payment', 'publisherPayment', 'userPayment', 'other'),
                        "field": "useType"
                    },
                    "resNum": {
                        "type": Sequelize.STRING,
                        "field": "resNum"
                    },
                    "description": {
                        "type": Sequelize.JSON,
                        "field": "description"
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    },
                    "publisherId": {
                        "type": Sequelize.BIGINT,
                        "field": "publisherId",
                        "onUpdate": "CASCADE",
                        "onDelete": "SET NULL",
                        "references": {
                            "model": "publishers",
                            "key": "id"
                        },
                        "allowNull": true
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "long_processes",
                {
                    "id": {
                        "type": Sequelize.BIGINT,
                        "field": "id",
                        "primaryKey": true,
                        "autoIncrement": true,
                        "unique": true
                    },
                    "metaData": {
                        "type": Sequelize.JSON,
                        "field": "metaData",
                        "defaultValue": Sequelize.Object
                    },
                    "name": {
                        "type": Sequelize.STRING,
                        "field": "name"
                    },
                    "refId": {
                        "type": Sequelize.STRING,
                        "field": "refId"
                    },
                    "startDate": {
                        "type": Sequelize.DATE,
                        "field": "startDate",
                        "defaultValue": Sequelize.NOW
                    },
                    "endDate": {
                        "type": Sequelize.DATE,
                        "field": "endDate"
                    },
                    "status": {
                        "type": Sequelize.STRING,
                        "field": "status",
                        "defaultValue": ""
                    },
                    "message": {
                        "type": Sequelize.TEXT,
                        "field": "message",
                        "defaultValue": ""
                    },
                    "state": {
                        "type": Sequelize.ENUM('called', 'running', 'complete', 'failed'),
                        "field": "state"
                    },
                    "timeout": {
                        "type": Sequelize.FLOAT,
                        "field": "timeout",
                        "defaultValue": 3600
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    },
                    "publisherId": {
                        "type": Sequelize.BIGINT,
                        "field": "publisherId",
                        "onUpdate": "CASCADE",
                        "onDelete": "SET NULL",
                        "references": {
                            "model": "publishers",
                            "key": "id"
                        },
                        "allowNull": true
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "payment_sources",
                {
                    "id": {
                        "type": Sequelize.BIGINT,
                        "field": "id",
                        "primaryKey": true,
                        "autoIncrement": true,
                        "unique": true
                    },
                    "name": {
                        "type": Sequelize.STRING,
                        "field": "name"
                    },
                    "gateway": {
                        "type": Sequelize.ENUM('sep', 'mellat', 'saman', 'zarrinPal', 'pay.ir', 'payping', 'parsian'),
                        "field": "gateway"
                    },
                    "data": {
                        "type": Sequelize.JSON,
                        "field": "data"
                    },
                    "isDefault": {
                        "type": Sequelize.BOOLEAN,
                        "field": "isDefault"
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    },
                    "publisherId": {
                        "type": Sequelize.BIGINT,
                        "field": "publisherId",
                        "onUpdate": "CASCADE",
                        "onDelete": "SET NULL",
                        "references": {
                            "model": "publishers",
                            "key": "id"
                        },
                        "allowNull": true
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "payment_transactions",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "autoIncrement": true,
                        "primaryKey": true,
                        "allowNull": false
                    },
                    "gateway": {
                        "type": Sequelize.STRING,
                        "field": "gateway"
                    },
                    "resNum": {
                        "type": Sequelize.STRING,
                        "field": "resNum",
                        "unique": true
                    },
                    "amount": {
                        "type": Sequelize.FLOAT,
                        "field": "amount"
                    },
                    "authorType": {
                        "type": Sequelize.ENUM('publisher', 'enduser', 'dummy'),
                        "field": "authorType"
                    },
                    "authorId": {
                        "type": Sequelize.BIGINT,
                        "field": "authorId"
                    },
                    "sourceType": {
                        "type": Sequelize.ENUM('weblancer', 'publisher', 'dummy'),
                        "field": "sourceType"
                    },
                    "sourceId": {
                        "type": Sequelize.BIGINT,
                        "field": "sourceId"
                    },
                    "weblancerState": {
                        "type": Sequelize.ENUM('init', 'userPayment', 'verifying', 'complete', 'error'),
                        "field": "weblancerState"
                    },
                    "redirectToken": {
                        "type": Sequelize.STRING,
                        "field": "redirectToken"
                    },
                    "paymentResponse": {
                        "type": Sequelize.JSON,
                        "field": "paymentResponse"
                    },
                    "success": {
                        "type": Sequelize.BOOLEAN,
                        "field": "success"
                    },
                    "finalState": {
                        "type": Sequelize.STRING,
                        "field": "finalState"
                    },
                    "message": {
                        "type": Sequelize.STRING,
                        "field": "message"
                    },
                    "initData": {
                        "type": Sequelize.JSON,
                        "field": "initData"
                    },
                    "paymentUrl": {
                        "type": Sequelize.STRING,
                        "field": "paymentUrl"
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    },
                    "publisherId": {
                        "type": Sequelize.BIGINT,
                        "field": "publisherId",
                        "onUpdate": "CASCADE",
                        "onDelete": "SET NULL",
                        "references": {
                            "model": "publishers",
                            "key": "id"
                        },
                        "allowNull": true
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "publisher_websites",
                {
                    "id": {
                        "type": Sequelize.BIGINT,
                        "field": "id",
                        "primaryKey": true,
                        "autoIncrement": true,
                        "unique": true
                    },
                    "name": {
                        "type": Sequelize.STRING,
                        "field": "name"
                    },
                    "displayName": {
                        "type": Sequelize.STRING,
                        "field": "displayName"
                    },
                    "description": {
                        "type": Sequelize.JSON,
                        "field": "description"
                    },
                    "serverIpAddress": {
                        "type": Sequelize.STRING,
                        "field": "serverIpAddress"
                    },
                    "url": {
                        "type": Sequelize.STRING,
                        "field": "url"
                    },
                    "metadata": {
                        "type": Sequelize.JSON,
                        "field": "metadata"
                    },
                    "type": {
                        "type": Sequelize.ENUM('website', 'service', 'app', 'component'),
                        "field": "type"
                    },
                    "endUserId": {
                        "type": Sequelize.STRING,
                        "field": "endUserId"
                    },
                    "endWebsiteId": {
                        "type": Sequelize.STRING,
                        "field": "endWebsiteId"
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    },
                    "publisherId": {
                        "type": Sequelize.BIGINT,
                        "field": "publisherId",
                        "onUpdate": "CASCADE",
                        "onDelete": "SET NULL",
                        "references": {
                            "model": "publishers",
                            "key": "id"
                        },
                        "allowNull": true
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "plan_sells",
                {
                    "id": {
                        "type": Sequelize.BIGINT,
                        "field": "id",
                        "primaryKey": true,
                        "autoIncrement": true,
                        "unique": true
                    },
                    "planObject": {
                        "type": Sequelize.JSON,
                        "field": "planObject"
                    },
                    "websitePlanObject": {
                        "type": Sequelize.JSON,
                        "field": "websitePlanObject"
                    },
                    "planId": {
                        "type": Sequelize.INTEGER,
                        "field": "planId",
                        "unique": "IX_publisherId_publisherWebsiteId_planId_dayString_isTrial"
                    },
                    "boughtDate": {
                        "type": Sequelize.DATE,
                        "field": "boughtDate"
                    },
                    "startDate": {
                        "type": Sequelize.DATE,
                        "field": "startDate"
                    },
                    "expireDate": {
                        "type": Sequelize.DATE,
                        "field": "expireDate"
                    },
                    "upgradeDate": {
                        "type": Sequelize.DATE,
                        "field": "upgradeDate"
                    },
                    "dayString": {
                        "type": Sequelize.STRING,
                        "field": "dayString",
                        "unique": "IX_publisherId_publisherWebsiteId_planId_dayString_isTrial"
                    },
                    "isTrial": {
                        "type": Sequelize.BOOLEAN,
                        "field": "isTrial",
                        "unique": "IX_publisherId_publisherWebsiteId_planId_dayString_isTrial"
                    },
                    "publisherId": {
                        "type": Sequelize.BIGINT,
                        "onUpdate": "CASCADE",
                        "onDelete": "CASCADE",
                        "references": {
                            "model": "publishers",
                            "key": "id"
                        },
                        "allowNull": true,
                        "field": "publisherId",
                        "unique": "IX_publisherId_publisherWebsiteId_planId_dayString_isTrial"
                    },
                    "publisherWebsiteId": {
                        "type": Sequelize.BIGINT,
                        "onUpdate": "CASCADE",
                        "onDelete": "CASCADE",
                        "references": {
                            "model": "publisher_websites",
                            "key": "id"
                        },
                        "allowNull": true,
                        "field": "publisherWebsiteId",
                        "unique": "IX_publisherId_publisherWebsiteId_planId_dayString_isTrial"
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "publisher_plans",
                {
                    "id": {
                        "type": Sequelize.BIGINT,
                        "field": "id",
                        "primaryKey": true,
                        "autoIncrement": true,
                        "unique": true
                    },
                    "boughtDate": {
                        "type": Sequelize.DATE,
                        "field": "boughtDate"
                    },
                    "expireDate": {
                        "type": Sequelize.DATE,
                        "field": "expireDate"
                    },
                    "totalPriceOfPlan": {
                        "type": Sequelize.FLOAT,
                        "field": "totalPriceOfPlan"
                    },
                    "totalPayForPlan": {
                        "type": Sequelize.FLOAT,
                        "field": "totalPayForPlan"
                    },
                    "upgradedToUpperPlan": {
                        "type": Sequelize.BOOLEAN,
                        "field": "upgradedToUpperPlan"
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    },
                    "planId": {
                        "type": Sequelize.INTEGER,
                        "field": "planId",
                        "onUpdate": "CASCADE",
                        "onDelete": "SET NULL",
                        "references": {
                            "model": "plans",
                            "key": "id"
                        },
                        "allowNull": true
                    },
                    "publisherId": {
                        "type": Sequelize.BIGINT,
                        "field": "publisherId",
                        "onUpdate": "CASCADE",
                        "onDelete": "SET NULL",
                        "references": {
                            "model": "publishers",
                            "key": "id"
                        },
                        "allowNull": true
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "product_sells",
                {
                    "id": {
                        "type": Sequelize.BIGINT,
                        "field": "id",
                        "primaryKey": true,
                        "autoIncrement": true,
                        "unique": true
                    },
                    "productId": {
                        "type": Sequelize.INTEGER,
                        "onUpdate": "CASCADE",
                        "onDelete": "CASCADE",
                        "references": {
                            "model": "products",
                            "key": "id"
                        },
                        "allowNull": true,
                        "field": "productId",
                        "unique": "IX_productId_publisherId_publisherWebsiteId_planId_dayString"
                    },
                    "isTrial": {
                        "type": Sequelize.BOOLEAN,
                        "field": "isTrial"
                    },
                    "sellPrice": {
                        "type": Sequelize.FLOAT,
                        "field": "sellPrice"
                    },
                    "publisherId": {
                        "type": Sequelize.BIGINT,
                        "onUpdate": "CASCADE",
                        "onDelete": "CASCADE",
                        "references": {
                            "model": "publishers",
                            "key": "id"
                        },
                        "allowNull": true,
                        "field": "publisherId",
                        "unique": "IX_productId_publisherId_publisherWebsiteId_planId_dayString"
                    },
                    "planId": {
                        "type": Sequelize.INTEGER,
                        "field": "planId",
                        "unique": "IX_productId_publisherId_publisherWebsiteId_planId_dayString"
                    },
                    "dayString": {
                        "type": Sequelize.STRING,
                        "field": "dayString",
                        "unique": "IX_productId_publisherId_publisherWebsiteId_planId_dayString"
                    },
                    "publisherWebsiteId": {
                        "type": Sequelize.BIGINT,
                        "onUpdate": "CASCADE",
                        "onDelete": "CASCADE",
                        "references": {
                            "model": "publisher_websites",
                            "key": "id"
                        },
                        "allowNull": true,
                        "field": "publisherWebsiteId",
                        "unique": "IX_productId_publisherId_publisherWebsiteId_planId_dayString"
                    },
                    "boughtDate": {
                        "type": Sequelize.DATE,
                        "field": "boughtDate"
                    },
                    "moneyBackDays": {
                        "type": Sequelize.INTEGER,
                        "field": "moneyBackDays",
                        "defaultValue": 14
                    },
                    "moneyBacked": {
                        "type": Sequelize.BOOLEAN,
                        "field": "moneyBacked",
                        "defaultValue": false
                    },
                    "planTime": {
                        "type": Sequelize.STRING,
                        "field": "planTime"
                    },
                    "metadata": {
                        "type": Sequelize.JSON,
                        "field": "metadata"
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "servers",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "primaryKey": true,
                        "autoIncrement": true,
                        "unique": true
                    },
                    "name": {
                        "type": Sequelize.STRING,
                        "field": "name",
                        "unique": true
                    },
                    "ipAddress": {
                        "type": Sequelize.STRING,
                        "field": "ipAddress"
                    },
                    "sudoPassword": {
                        "type": Sequelize.STRING,
                        "field": "sudoPassword"
                    },
                    "url": {
                        "type": Sequelize.STRING,
                        "field": "url"
                    },
                    "type": {
                        "type": Sequelize.ENUM('publisher', 'editor', 'hoster'),
                        "field": "type"
                    },
                    "ownerType": {
                        "type": Sequelize.ENUM('weblancer', 'publisher'),
                        "field": "ownerType"
                    },
                    "cpuUsage": {
                        "type": Sequelize.FLOAT,
                        "field": "cpuUsage"
                    },
                    "memoryUsage": {
                        "type": Sequelize.FLOAT,
                        "field": "memoryUsage"
                    },
                    "storageUsage": {
                        "type": Sequelize.FLOAT,
                        "field": "storageUsage"
                    },
                    "count": {
                        "type": Sequelize.INTEGER,
                        "field": "count"
                    },
                    "timezone": {
                        "type": Sequelize.TIME,
                        "field": "timezone"
                    },
                    "metadata": {
                        "type": Sequelize.JSON,
                        "field": "metadata",
                        "defaultValue": Sequelize.Object
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    },
                    "mainServerOfPublisherId": {
                        "type": Sequelize.BIGINT,
                        "field": "mainServerOfPublisherId",
                        "onUpdate": "CASCADE",
                        "onDelete": "SET NULL",
                        "references": {
                            "model": "publishers",
                            "key": "id"
                        },
                        "allowNull": true
                    },
                    "publisherId": {
                        "type": Sequelize.BIGINT,
                        "field": "publisherId",
                        "onUpdate": "CASCADE",
                        "onDelete": "SET NULL",
                        "references": {
                            "model": "publishers",
                            "key": "id"
                        },
                        "allowNull": true
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "addIndex",
            params: [
                "publisher_websites",
                ["name", "endUserId", "publisherId"],
                {
                    "indexName": "publisher_websites_name_end_user_id_publisher_id",
                    "name": "publisher_websites_name_end_user_id_publisher_id",
                    "indicesType": "UNIQUE",
                    "type": "UNIQUE",
                    "transaction": transaction
                }
            ]
        }
    ];
};
var rollbackCommands = function(transaction) {
    return [{
            fn: "dropTable",
            params: ["configs", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["credit_transactions", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["long_processes", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["payment_sources", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["payment_transactions", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["plan_sells", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["plans", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["product_sells", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["products", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["publisher_plans", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["publisher_websites", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["publishers", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["servers", {
                transaction: transaction
            }]
        }
    ];
};

module.exports = {
    pos: 0,
    useTransaction: true,
    execute: function(queryInterface, Sequelize, _commands)
    {
        var index = this.pos;
        function run(transaction) {
            const commands = _commands(transaction);
            return new Promise(function(resolve, reject) {
                function next() {
                    if (index < commands.length)
                    {
                        let command = commands[index];
                        console.log("[#"+index+"] execute: " + command.fn);
                        index++;
                        queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                    }
                    else
                        resolve();
                }
                next();
            });
        }
        if (this.useTransaction) {
            return queryInterface.sequelize.transaction(run);
        } else {
            return run(null);
        }
    },
    up: function(queryInterface, Sequelize)
    {
        return this.execute(queryInterface, Sequelize, migrationCommands);
    },
    down: function(queryInterface, Sequelize)
    {
        return this.execute(queryInterface, Sequelize, rollbackCommands);
    },
    info: info
};

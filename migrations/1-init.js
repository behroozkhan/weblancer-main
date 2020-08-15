'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "configs", deps: []
 * createTable "plans", deps: []
 * createTable "publishers", deps: []
 * createTable "credit_transactions", deps: [publishers]
 * createTable "payment_sources", deps: [publishers]
 * createTable "payment_transactions", deps: [publishers]
 * createTable "publisher_plans", deps: [plans, publishers]
 * createTable "publisher_websites", deps: [publishers]
 * createTable "servers", deps: [publishers, publishers]
 * createTable "websites", deps: [publisher_websites]
 *
 **/

var info = {
    "revision": 1,
    "name": "init",
    "created": "2020-08-15T16:46:37.806Z",
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
                    "subDomain": {
                        "type": Sequelize.STRING,
                        "field": "subDomain",
                        "unique": true
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
                    "expireTime": {
                        "type": Sequelize.DATE,
                        "field": "expireTime"
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
                "publisher_websites",
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
                    "expireTime": {
                        "type": Sequelize.DATE,
                        "field": "expireTime"
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
                    "extended": {
                        "type": Sequelize.BOOLEAN,
                        "field": "extended"
                    },
                    "planOrder": {
                        "type": Sequelize.INTEGER,
                        "field": "planOrder"
                    },
                    "resource": {
                        "type": Sequelize.JSON,
                        "field": "resource"
                    },
                    "endUserId": {
                        "type": Sequelize.STRING,
                        "field": "endUserId"
                    },
                    "endWebsiteId": {
                        "type": Sequelize.STRING,
                        "field": "endWebsiteId"
                    },
                    "metadata": {
                        "type": Sequelize.JSON,
                        "field": "metadata"
                    },
                    "type": {
                        "type": Sequelize.ENUM('website', 'service', 'app', 'component'),
                        "field": "type"
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
                    "mainServerId": {
                        "type": Sequelize.BIGINT,
                        "field": "mainServerId",
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
            fn: "createTable",
            params: [
                "websites",
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
                    "basePriceMonthly": {
                        "type": Sequelize.FLOAT,
                        "field": "basePriceMonthly"
                    },
                    "basePriceYearly": {
                        "type": Sequelize.FLOAT,
                        "field": "basePriceYearly"
                    },
                    "baseOffPriceMonthly": {
                        "type": Sequelize.FLOAT,
                        "field": "baseOffPriceMonthly"
                    },
                    "baseOffPriceYearly": {
                        "type": Sequelize.FLOAT,
                        "field": "baseOffPriceYearly"
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
                    "resourceMax": {
                        "type": Sequelize.JSON,
                        "field": "resourceMax"
                    },
                    "planType": {
                        "type": Sequelize.ENUM('resource', 'permission'),
                        "field": "planType"
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
                    "publisherWebsiteId": {
                        "type": Sequelize.BIGINT,
                        "field": "publisherWebsiteId",
                        "onUpdate": "CASCADE",
                        "onDelete": "SET NULL",
                        "references": {
                            "model": "publisher_websites",
                            "key": "id"
                        },
                        "allowNull": true
                    }
                },
                {
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
            params: ["plans", {
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
        },
        {
            fn: "dropTable",
            params: ["websites", {
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

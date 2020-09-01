'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * removeColumn "totalPrice" from table "publisher_websites"
 * removeColumn "expireTime" from table "publisher_plans"
 * removeColumn "addedPrice" from table "publisher_websites"
 * removeColumn "addedProducts" from table "publisher_websites"
 * removeColumn "totalPayment" from table "publisher_websites"
 * removeColumn "totalPayForPlan" from table "publisher_websites"
 * removeColumn "totalPriceOfPlan" from table "publisher_websites"
 * removeColumn "expireDate" from table "publisher_websites"
 * removeColumn "planStartDate" from table "publisher_websites"
 * removeColumn "boughtDate" from table "publisher_websites"
 * removeColumn "productsDetail" from table "publisher_websites"
 * createTable "plan_sells", deps: [publishers, publisher_websites]
 * createTable "product_sells", deps: [products, publishers, publisher_websites]
 * addColumn "expireDate" to table "publisher_plans"
 *
 **/

var info = {
    "revision": 21,
    "name": "refactorPlans",
    "created": "2020-09-01T15:24:53.494Z",
    "comment": ""
};

var migrationCommands = function(transaction) {
    return [{
            fn: "removeColumn",
            params: [
                "publisher_websites",
                "totalPrice",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "publisher_plans",
                "expireTime",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "publisher_websites",
                "addedPrice",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "publisher_websites",
                "addedProducts",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "publisher_websites",
                "totalPayment",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "publisher_websites",
                "totalPayForPlan",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "publisher_websites",
                "totalPriceOfPlan",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "publisher_websites",
                "expireDate",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "publisher_websites",
                "planStartDate",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "publisher_websites",
                "boughtDate",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "publisher_websites",
                "productsDetail",
                {
                    transaction: transaction
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
            fn: "addColumn",
            params: [
                "publisher_plans",
                "expireDate",
                {
                    "type": Sequelize.DATE,
                    "field": "expireDate"
                },
                {
                    transaction: transaction
                }
            ]
        }
    ];
};
var rollbackCommands = function(transaction) {
    return [{
            fn: "removeColumn",
            params: [
                "publisher_plans",
                "expireDate",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "dropTable",
            params: ["plan_sells", {
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
            fn: "addColumn",
            params: [
                "publisher_plans",
                "expireTime",
                {
                    "type": Sequelize.DATE,
                    "field": "expireTime"
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "publisher_websites",
                "totalPriceOfPlan",
                {
                    "type": Sequelize.FLOAT,
                    "field": "totalPriceOfPlan"
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "publisher_websites",
                "totalPrice",
                {
                    "type": Sequelize.FLOAT,
                    "field": "totalPrice"
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "publisher_websites",
                "addedPrice",
                {
                    "type": Sequelize.FLOAT,
                    "field": "addedPrice"
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "publisher_websites",
                "addedProducts",
                {
                    "type": Sequelize.JSON,
                    "field": "addedProducts"
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "publisher_websites",
                "productsDetail",
                {
                    "type": Sequelize.JSON,
                    "field": "productsDetail"
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "publisher_websites",
                "totalPayForPlan",
                {
                    "type": Sequelize.FLOAT,
                    "field": "totalPayForPlan"
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "publisher_websites",
                "totalPayment",
                {
                    "type": Sequelize.FLOAT,
                    "field": "totalPayment"
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "publisher_websites",
                "expireDate",
                {
                    "type": Sequelize.DATE,
                    "field": "expireDate"
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "publisher_websites",
                "planStartDate",
                {
                    "type": Sequelize.DATE,
                    "field": "planStartDate"
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "publisher_websites",
                "boughtDate",
                {
                    "type": Sequelize.DATE,
                    "field": "boughtDate"
                },
                {
                    transaction: transaction
                }
            ]
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

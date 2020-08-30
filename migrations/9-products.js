'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * removeColumn "upgradedToUpperPlan" from table "publisher_websites"
 * removeColumn "resource" from table "publisher_websites"
 * removeColumn "extended" from table "publisher_websites"
 * dropTable "websites"
 * createTable "products", deps: []
 * addColumn "planStartDate" to table "publisher_websites"
 * addColumn "description" to table "publisher_websites"
 * addColumn "addedProducts" to table "publisher_websites"
 * addColumn "addedPrice" to table "publisher_websites"
 * addColumn "totalPrice" to table "publisher_websites"
 * addColumn "totalPayment" to table "publisher_websites"
 * addColumn "name" to table "publisher_websites"
 * addColumn "productsDetail" to table "publisher_websites"
 *
 **/

var info = {
    "revision": 9,
    "name": "products",
    "created": "2020-08-30T11:57:50.432Z",
    "comment": ""
};

var migrationCommands = function(transaction) {
    return [{
            fn: "removeColumn",
            params: [
                "publisher_websites",
                "upgradedToUpperPlan",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "publisher_websites",
                "resource",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "publisher_websites",
                "extended",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "dropTable",
            params: ["websites", {
                transaction: transaction
            }]
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
                    "bindType": {
                        "type": Sequelize.ENUM('acount', 'good', 'website'),
                        "field": "bindType"
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
                "description",
                {
                    "type": Sequelize.JSON,
                    "field": "description"
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
                "name",
                {
                    "type": Sequelize.STRING,
                    "field": "name",
                    "unique": true
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
        }
    ];
};
var rollbackCommands = function(transaction) {
    return [{
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
                "description",
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
                "productsDetail",
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
                "name",
                {
                    transaction: transaction
                }
            ]
        },
        {
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
                "publisher_websites",
                "totalPayment",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "dropTable",
            params: ["products", {
                transaction: transaction
            }]
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
        },
        {
            fn: "addColumn",
            params: [
                "publisher_websites",
                "upgradedToUpperPlan",
                {
                    "type": Sequelize.BOOLEAN,
                    "field": "upgradedToUpperPlan"
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
                "extended",
                {
                    "type": Sequelize.BOOLEAN,
                    "field": "extended"
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
                "resource",
                {
                    "type": Sequelize.JSON,
                    "field": "resource"
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

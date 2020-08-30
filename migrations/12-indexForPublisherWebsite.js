'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "publisherId" on table "publisher_websites"
 * addIndex "publisher_websites_name_end_user_id_publisher_id" to table "publisher_websites"
 *
 **/

var info = {
    "revision": 12,
    "name": "indexForPublisherWebsite",
    "created": "2020-08-30T13:24:37.390Z",
    "comment": ""
};

var migrationCommands = function(transaction) {
    return [{
            fn: "changeColumn",
            params: [
                "publisher_websites",
                "publisherId",
                {
                    "type": Sequelize.BIGINT,
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "publishers",
                        "key": "id"
                    },
                    "allowNull": true,
                    "field": "publisherId"
                },
                {
                    transaction: transaction
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
            fn: "removeIndex",
            params: [
                "publisher_websites",
                "publisher_websites_name_end_user_id_publisher_id",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "changeColumn",
            params: [
                "publisher_websites",
                "publisherId",
                {
                    "type": Sequelize.BIGINT,
                    "field": "publisherId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "publishers",
                        "key": "id"
                    },
                    "allowNull": true
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

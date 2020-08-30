'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "displayName" to table "publisher_websites"
 * addColumn "serverIpAddress" to table "publisher_websites"
 * addColumn "url" to table "publisher_websites"
 *
 **/

var info = {
    "revision": 14,
    "name": "addNewWebsiteChanges",
    "created": "2020-08-30T15:20:55.281Z",
    "comment": ""
};

var migrationCommands = function(transaction) {
    return [{
            fn: "addColumn",
            params: [
                "publisher_websites",
                "displayName",
                {
                    "type": Sequelize.STRING,
                    "field": "displayName"
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
                "serverIpAddress",
                {
                    "type": Sequelize.STRING,
                    "field": "serverIpAddress"
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
                "url",
                {
                    "type": Sequelize.STRING,
                    "field": "url"
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
                "displayName",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "publisher_websites",
                "serverIpAddress",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "publisher_websites",
                "url",
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

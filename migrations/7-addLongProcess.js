'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "metaData" on table "long_processes"
 * changeColumn "startDate" on table "long_processes"
 * changeColumn "status" on table "long_processes"
 * changeColumn "message" on table "long_processes"
 * changeColumn "timeout" on table "long_processes"
 *
 **/

var info = {
    "revision": 7,
    "name": "addLongProcess",
    "created": "2020-08-18T15:06:38.669Z",
    "comment": ""
};

var migrationCommands = function(transaction) {
    return [{
            fn: "changeColumn",
            params: [
                "long_processes",
                "metaData",
                {
                    "type": Sequelize.JSON,
                    "field": "metaData",
                    "defaultValue": Sequelize.Object
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "changeColumn",
            params: [
                "long_processes",
                "startDate",
                {
                    "type": Sequelize.DATE,
                    "field": "startDate",
                    "defaultValue": Sequelize.NOW
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "changeColumn",
            params: [
                "long_processes",
                "status",
                {
                    "type": Sequelize.STRING,
                    "field": "status",
                    "defaultValue": ""
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "changeColumn",
            params: [
                "long_processes",
                "message",
                {
                    "type": Sequelize.STRING,
                    "field": "message",
                    "defaultValue": ""
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "changeColumn",
            params: [
                "long_processes",
                "timeout",
                {
                    "type": Sequelize.FLOAT,
                    "field": "timeout",
                    "defaultValue": 3600
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
            fn: "changeColumn",
            params: [
                "long_processes",
                "metaData",
                {
                    "type": Sequelize.JSON,
                    "field": "metaData"
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "changeColumn",
            params: [
                "long_processes",
                "startDate",
                {
                    "type": Sequelize.DATE,
                    "field": "startDate"
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "changeColumn",
            params: [
                "long_processes",
                "status",
                {
                    "type": Sequelize.STRING,
                    "field": "status"
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "changeColumn",
            params: [
                "long_processes",
                "message",
                {
                    "type": Sequelize.STRING,
                    "field": "message"
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "changeColumn",
            params: [
                "long_processes",
                "timeout",
                {
                    "type": Sequelize.FLOAT,
                    "field": "timeout"
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

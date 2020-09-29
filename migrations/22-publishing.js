'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "publisherWebsiteDomain" to table "publishers"
 *
 **/

var info = {
    "revision": 22,
    "name": "publishing",
    "created": "2020-09-29T06:32:54.407Z",
    "comment": ""
};

var migrationCommands = function(transaction) {
    return [{
        fn: "addColumn",
        params: [
            "publishers",
            "publisherWebsiteDomain",
            {
                "type": Sequelize.STRING,
                "field": "publisherWebsiteDomain"
            },
            {
                transaction: transaction
            }
        ]
    }];
};
var rollbackCommands = function(transaction) {
    return [{
        fn: "removeColumn",
        params: [
            "publishers",
            "publisherWebsiteDomain",
            {
                transaction: transaction
            }
        ]
    }];
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

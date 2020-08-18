'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "long_processes", deps: [publishers]
 *
 **/

var info = {
    "revision": 6,
    "name": "addLongProcess",
    "created": "2020-08-18T09:59:55.639Z",
    "comment": ""
};

var migrationCommands = function(transaction) {
    return [{
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
                    "field": "metaData"
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
                    "field": "startDate"
                },
                "endDate": {
                    "type": Sequelize.DATE,
                    "field": "endDate"
                },
                "status": {
                    "type": Sequelize.STRING,
                    "field": "status"
                },
                "message": {
                    "type": Sequelize.STRING,
                    "field": "message"
                },
                "state": {
                    "type": Sequelize.ENUM('called', 'running', 'complete', 'failed'),
                    "field": "state"
                },
                "timeout": {
                    "type": Sequelize.FLOAT,
                    "field": "timeout"
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
    }];
};
var rollbackCommands = function(transaction) {
    return [{
        fn: "dropTable",
        params: ["long_processes", {
            transaction: transaction
        }]
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

'use strict';

import Sequelize from 'sequelize';

/**
 * Actions summary:
 *
 * createTable "publishers", deps: []
 * createTable "payment_transactions", deps: []
 * createTable "plans", deps: []
 * createTable "servers", deps: []
 * createTable "configs", deps: []
 * createTable "publisher_plans", deps: []
 * createTable "credit_transactions", deps: []
 * createTable "websites", deps: []
 * createTable "publisher_websites", deps: []
 * createTable "payment_sources", deps: []
 *
 **/

var info = {
    "revision": 1,
    "name": "initM",
    "created": "2020-08-15T10:08:09.459Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "publishers",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "payment_transactions",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "plans",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "servers",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "configs",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "publisher_plans",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "credit_transactions",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "websites",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "publisher_websites",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "payment_sources",
            {

            },
            {}
        ]
    }
];

export {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};

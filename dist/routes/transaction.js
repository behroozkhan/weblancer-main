'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
    // return all available transactions
});

router.get('/publisher/:id', function (req, res) {
    // return all transaction of publisher id
});

router.get('/:id', function (req, res) {
    // return transaction by id
});

router.post('/', function (req, res) {
    // creat new transaction
});

router.put('/', function (req, res) {
    // update transaction
});

router.delete('/', function (req, res) {
    // delete transaction
});

exports.default = router;
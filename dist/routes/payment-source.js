'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
    // return all paymentSources
});

router.get('/mine', function (req, res) {
    // return all paymentSource of publisher
});

router.get('/:id', function (req, res) {
    // get paymentSource by id
});

router.post('/', function (req, res) {
    // creat new paymentSource
});

router.put('/', function (req, res) {
    // update paymentSource
});

router.delete('/', function (req, res) {
    // delete paymentSource
});

exports.default = router;
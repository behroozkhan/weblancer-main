'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
    // return all available plans
});

router.get('/:id', function (req, res) {
    // return plan by id
});

router.post('/', function (req, res) {
    // creat new plan
});

router.put('/', function (req, res) {
    // update plan
});

router.delete('/', function (req, res) {
    // delete plan
});

exports.default = router;
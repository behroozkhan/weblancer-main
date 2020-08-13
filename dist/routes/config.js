'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
    // return all available configs
});

router.get('/:id', function (req, res) {
    // return config by id
});

router.post('/', function (req, res) {
    // creat new config
});

router.put('/', function (req, res) {
    // update config
});

router.delete('/', function (req, res) {
    // delete config
});

exports.default = router;
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
    // return all servers
});

router.get('/type/:type', function (req, res) {
    // return all server by type
});

router.get('/:id', function (req, res) {
    // get server by id
});

router.post('/', function (req, res) {
    // creat new server
});

router.put('/', function (req, res) {
    // update server
});

router.delete('/', function (req, res) {
    // delete server
});

router.get('/lower/:type', function (req, res) {
    // return lower usage server by type
});

exports.default = router;
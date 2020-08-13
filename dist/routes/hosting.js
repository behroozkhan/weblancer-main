'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/publish', function (req, res) {
    // publish recived site
});

router.post('/domain', function (req, res) {
    // set requested domain for website
});

exports.default = router;
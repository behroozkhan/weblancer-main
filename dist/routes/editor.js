'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/editoraccess', function (req, res) {
    // from publisher server to editor servers
    // set and return access token for a user in editor server
});

module.exports = router;
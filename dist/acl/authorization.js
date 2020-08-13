'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.authorizeToken = authorizeToken;
exports.generateAccessToken = generateAccessToken;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function authorizeToken(req, res, next) {
    var authHeader = req.headers['authorization'];
    var token = authHeader && authHeader.split(' ')[1];

    if (token == null) res.sendStatus(401);

    _jsonwebtoken2.default.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, function (err, user) {
        if (err) res.sendStatus(403);
        req.user = user;
        next();
    });
}

function generateAccessToken(user) {
    var expireTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '30d';

    return _jsonwebtoken2.default.sign(user, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: expireTime });
}
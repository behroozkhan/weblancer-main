'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.authorizeToken = authorizeToken;
exports.generateAccessToken = generateAccessToken;
var jwt = require('jsonwebtoken');

function authorizeToken(req, res, next) {
    var authHeader = req.headers['authorization'];
    var token = authHeader && authHeader.split(' ')[1];

    if (token == null) res.sendStatus(401);

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, function (err, user) {
        if (err) res.sendStatus(403);
        req.user = user;
        next();
    });
}

function generateAccessToken(user) {
    var expireTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '30d';

    return jwt.sign(user, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: expireTime });
}
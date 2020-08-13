'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.unlessRoute = unlessRoute;
exports.getRandomInt = getRandomInt;
exports.makeResNum = makeResNum;
function unlessRoute(path, middleware) {
    return function (req, res, next) {
        if (path.includes(req.baseUrl)) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeResNum(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
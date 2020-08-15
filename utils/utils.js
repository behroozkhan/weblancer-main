module.exports.unlessRoute = function unlessRoute (path, middleware) {
    return function(req, res, next) {
        if (path.includes(req.url)) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};

module.exports.getRandomInt = function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.makeResNum = function makeResNum(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
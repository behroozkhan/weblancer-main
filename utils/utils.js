export function unlessRoute (path, middleware) {
    return function(req, res, next) {
        console.log("req.baseUrl", req.baseUrl);
        if (path.includes(req.baseUrl)) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function makeResNum(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
 
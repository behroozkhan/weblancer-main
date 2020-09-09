let jwt = require('jsonwebtoken');
let { models } = require('../model-manager/models.js');
const Response = require('../utils/response.js');
const axios = require('axios');

module.exports.authorizeToken = function authorizeToken(req, res, next) {
    const publisherId = req.headers['publisher-id'];
    const publisherPassword = req.headers['publisher-password'];
    const publisherApiKey = req.headers['publisher-api-key'];
    console.log("authorizeToken headers", req.headers);

    if (publisherId) {
        console.log("authorizeToken publisherId", publisherId);
        models.Publisher.findOne({
            where: { id: publisherId, password: publisherPassword},
            attributes: ['id', 'role']
        }).then(publisher => {
            if (!publisher) {
                res.status(401).json(
                    new Response(false, {}, "id and password are not match").json()
                );
            } else {
                req.user = publisher.toJSON();
                next();
            }
        }).catch(error => {
            console.log("authorizeToken Error", error);
            res.status(500).json(
                new Response(false, {error}, "Error on authorizing publisher").json()
            );
        });
    } else {
        const authHeader = req.headers['authorization'];
        console.log("authorizeToken authHeader", authHeader);
        const token = authHeader && authHeader.split(' ')[1];
    
        if (token == null) {
            res.sendStatus(401);
            return;
        }
    
        jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                res.sendStatus(403);
                return;
            }

            req.user = user;
            next();
        });
    }
}

module.exports.generateAccessToken = function generateAccessToken(user, expireTime = '30d') {
    return jwt.sign(user, process.env.JWT_ACCESS_TOKEN_SECRET, {expiresIn: expireTime});
}
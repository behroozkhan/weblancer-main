'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.checkPermissions = checkPermissions;

var _models = require('../models/models.js');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Acl = require('acl');
var AclSeq = require('acl-sequelize');

var acl = new Acl(new AclSeq(_models.sequelize, { prefix: 'acl_' }));

acl.addRoleParents('weblancer', 'admin', 'user');

acl.allow([{
    roles: ['publisher'],
    allows: [{
        resources: ['/publisher'],
        permissions: ['post']
    }, {
        resources: ['/transaction'],
        permissions: ['post', 'get']
    }, {
        resources: ['/plan'],
        permissions: ['get']
    }]
}, {
    roles: ['admin'],
    allows: [{
        resources: ['/publisher', '/transaction', '/plan', '/editor', '/hosting', '/middle'],
        permissions: ['get', 'post', 'put', 'delete']
    }]
}, {
    roles: ['weblancer'],
    allows: [{
        resources: ['/publisher', '/transaction', '/plan', '/editor', '/hosting', '/middle'],
        permissions: ['get', 'post', 'put', 'delete']
    }]
}]);

function checkPermissions(req, res, next) {
    if (req.user) {
        acl.isAllowed(req.user.id, req.url, req.method.toLowerCase(), function (error, allowed) {
            if (allowed) {
                console.log('Authorization passed');
                next();
            } else {
                console.log('Authorization failed');
                res.send({ message: 'Insufficient permissions to access resource' });
            }
        });
    } else {
        res.send({ message: 'User not authenticated' });
    }
}

exports.default = acl;
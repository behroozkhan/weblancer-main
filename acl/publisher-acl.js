import models, { sequelize } from '../models/models.js';
import Acl from 'acl';
// import AclSeq from 'acl-sequelize';
import SequelizeBackend from 'acl-sequelize-backend';

// let acl = new Acl(new AclSeq(sequelize, { prefix: 'acl_' }));

let aclOptions = {};
let tablePrefix = 'acl_';
let acl = new Acl(new SequelizeBackend(sequelize, tablePrefix, aclOptions));

acl.allow([
    {
        roles: ['publisher'],
        allows: [
            {
                resources: ['/publisher'],
                permissions: ['post'],
            },
            {
                resources: ['/transaction'],
                permissions: ['post', 'get'],
            },
            {
                resources: ['/plan'],
                permissions: ['get'],
            }
        ],
    },
    {
        roles: ['admin'],
        allows: [
            {
                resources: ['/publisher', '/transaction', '/plan', '/editor', '/hosting', '/middle'],
                permissions: ['get', 'post', 'put', 'delete'],
            }
        ],
    },
    {
        roles: ['weblancer'],
        allows: [
            {
                resources: ['/publisher', '/transaction', '/plan', '/editor', '/hosting', '/middle'],
                permissions: ['get', 'post', 'put', 'delete'],
            }
        ],
    }
]);

export function checkPermissions(req, res, next) {
    if (req.user) {
        acl.isAllowed(
            req.user.id,
            req.url, req.method.toLowerCase(), (error, allowed) => {
                if (allowed) {
                    console.log('Authorization passed');
                    next();
                } else {
                    console.log('Authorization failed')
                    res.send({ message: 'Insufficient permissions to access resource' })
                }
            }
        );
    } else {
        res.send({ message: 'User not authenticated' })
    }
}

export default acl;
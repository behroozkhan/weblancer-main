'use strict';

var _models = require('./models/models.js');

var _publisherAcl = require('./acl/publisher-acl.js');

var _authorization = require('./acl/authorization.js');

var _utils = require('./utils/utils.js');

require('dotenv').config();

var express = require('express');
var app = express();

app.use(express.json());
app.use((0, _utils.unlessRoute)(['/publisher/login', '/publisher/register'], _authorization.authorizeToken));
app.use((0, _utils.unlessRoute)(['/publisher/login', '/publisher/register'], _publisherAcl.checkPermissions));

var payment = require('./routes/payment.js');
var editor = require('./routes/editor.js');
var hosting = require('./routes/hosting.js');
var publisher = require('./routes/publisher.js');
var transaction = require('./routes/transaction.js');
var plan = require('./routes/plan.js');
var server = require('./routes/server.js');
var middle = require('./routes/middle.js');

app.use('/payment', payment);
app.use('/editor', editor);
app.use('/hosting', hosting);
app.use('/publisher', publisher);
app.use('/transaction', transaction);
app.use('/plan', plan);
app.use('/server', server);
app.use('/middle', middle);

_models.sequelize.sync().then(function () {
    app.listen(process.env.PORT, function () {
        console.log('Weblancer main express server now listening on port ' + process.env.PORT + '!');
    });
});
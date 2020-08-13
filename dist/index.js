'use strict';

require('dotenv/config');

var _models = require('./models/models.js');

var _publisherAcl = require('./acl/publisher-acl.js');

var _authorization = require('./acl/authorization.js');

var _utils = require('./utils/utils.js');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _payment = require('./routes/payment.js');

var _payment2 = _interopRequireDefault(_payment);

var _editor = require('./routes/editor.js');

var _editor2 = _interopRequireDefault(_editor);

var _hosting = require('./routes/hosting.js');

var _hosting2 = _interopRequireDefault(_hosting);

var _publisher = require('./routes/publisher.js');

var _publisher2 = _interopRequireDefault(_publisher);

var _transaction = require('./routes/transaction.js');

var _transaction2 = _interopRequireDefault(_transaction);

var _plan = require('./routes/plan.js');

var _plan2 = _interopRequireDefault(_plan);

var _server = require('./routes/server.js');

var _server2 = _interopRequireDefault(_server);

var _middle = require('./routes/middle.js');

var _middle2 = _interopRequireDefault(_middle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use(_express2.default.json());
app.use((0, _utils.unlessRoute)(['/publisher/login', '/publisher/register'], _authorization.authorizeToken));
app.use((0, _utils.unlessRoute)(['/publisher/login', '/publisher/register'], _publisherAcl.checkPermissions));

app.use('/payment', _payment2.default);
app.use('/editor', _editor2.default);
app.use('/hosting', _hosting2.default);
app.use('/publisher', _publisher2.default);
app.use('/transaction', _transaction2.default);
app.use('/plan', _plan2.default);
app.use('/server', _server2.default);
app.use('/middle', _middle2.default);

_models.sequelize.sync().then(function () {
    app.listen(process.env.PORT, function () {
        console.log('Weblancer main express server now listening on port ' + process.env.PORT + '!');
    });
});
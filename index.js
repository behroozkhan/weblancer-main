import { sequelize } from './models/models.js';
import { checkPermissions } from './acl/publisher-acl.js';
import { authorizeToken } from './acl/authorization.js';
import { unlessRoute } from './utils/utils.js';

require('dotenv').config();

let express = require('express');
let app = express();

app.use(express.json());
app.use(unlessRoute(['/publisher/login', '/publisher/register'], authorizeToken));
app.use(unlessRoute(['/publisher/login', '/publisher/register'], checkPermissions));

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
 
sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Weblancer main express server now listening on port ${process.env.PORT}!`);
    });
});
let { sequelize } = require('./models/models.js');
let { authorizeToken } = require('./acl/authorization.js');
let { unlessRoute } = require('./utils/utils.js');
let express = require('express');
let cors = require('cors');

<<<<<<< HEAD
import payment from './routes/payment.js';
import editor from './routes/editor.js';
import hosting from './routes/hosting.js';
import publisher from './routes/publisher.js';
import transaction from './routes/transaction.js';
import plan from './routes/plan.js';
import server from './routes/server.js';
import middle from './routes/middle.js';
import Response from './utils/response.js';
import cors from 'cors';

const appBaseRoute = '/whitelabel';
=======
let payment = require('./routes/payment.js');
let editor = require('./routes/editor.js');
let hosting = require('./routes/hosting.js');
let publisher = require('./routes/publisher.js');
let transaction = require('./routes/transaction.js');
let plan = require('./routes/plan.js');
let server = require('./routes/server.js');
let middle = require('./routes/middle.js');
const Response = require('./utils/response.js');
>>>>>>> a833008c613929c62b59e620b708864b9f21bb00

let app = express();
app.use(cors());
<<<<<<< HEAD
app.options('*', cors());
=======
>>>>>>> a833008c613929c62b59e620b708864b9f21bb00

app.use(express.json());
app.use(unlessRoute([
    appBaseRoute + '/test', 
    appBaseRoute + '/', 
    appBaseRoute + '', 
    appBaseRoute + '/publisher/login', 
    appBaseRoute + '/publisher/register'
], authorizeToken));

app.use(appBaseRoute + '/payment', payment);
app.use(appBaseRoute + '/editor', editor);
app.use(appBaseRoute + '/hosting', hosting);
app.use(appBaseRoute + '/publisher', publisher);
app.use(appBaseRoute + '/transaction', transaction);
app.use(appBaseRoute + '/plan', plan);
app.use(appBaseRoute + '/server', server);
app.use(appBaseRoute + '/middle', middle);

app.get(appBaseRoute + '/test', function (req, res) {
    res.json(
        new Response(true, {}, 
            "Tested Successfully"
        ).json()
    );
})
 
<<<<<<< HEAD
sequelize.sync({logging: false}).then(() => {
=======
sequelize.sync({logging: true}).then(() => {
>>>>>>> a833008c613929c62b59e620b708864b9f21bb00
    app.listen(process.env.PORT, () => {
        console.log(`Weblancer main express server now listening on port ${process.env.PORT}!`);
    });
});
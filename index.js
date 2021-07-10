let { sequelize } = require('./model-manager/models.js');
let { authorizeToken } = require('./acl/authorization.js');
let { unlessRoute } = require('./utils/utils.js');
let express = require('express');
let cors = require('cors');

let config = require('./routes/config.js');
let payment = require('./routes/payment.js');
let editor = require('./routes/editor.js');
let hosting = require('./routes/hosting.js');
let publisher = require('./routes/publisher.js');
let transaction = require('./routes/transaction.js');
let plan = require('./routes/plan.js');
let server = require('./routes/server.js');
let middle = require('./routes/middle.js');
let longProcess = require('./routes/long-process.js');
let website = require('./routes/website.js');
const Response = require('./utils/response.js');
const appBaseRoute = '/api';

let app = express();
app.use(cors());
app.options('*', cors());

app.use(express.json({ limit: "50mb" }));
app.use(unlessRoute([
    appBaseRoute + '/test', 
    appBaseRoute + '/', 
    appBaseRoute + '', 
    appBaseRoute + '/publisher/login', 
    appBaseRoute + '/publisher/register'
], authorizeToken));

app.use(appBaseRoute + '/long-process', longProcess);
app.use(appBaseRoute + '/config', config);
app.use(appBaseRoute + '/payment', payment);
app.use(appBaseRoute + '/editor', editor);
app.use(appBaseRoute + '/hosting', hosting);
app.use(appBaseRoute + '/publisher', publisher);
app.use(appBaseRoute + '/transaction', transaction);
app.use(appBaseRoute + '/plan', plan);
app.use(appBaseRoute + '/server', server);
app.use(appBaseRoute + '/middle', middle);
app.use(appBaseRoute + '/website', website);

app.get(appBaseRoute + '/test', function (req, res) {
    res.json(
        new Response(true, {}, 
            "Tested Successfully"
        ).json()
    );
})
 
sequelize.sync({logging: false}).then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Weblancer main express server now listening on port ${process.env.PORT}!`);
    });
});
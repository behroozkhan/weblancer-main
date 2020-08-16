let { sequelize } = require('./model-manager/models.js');
let { authorizeToken } = require('./acl/authorization.js');
let { unlessRoute } = require('./utils/utils.js');
let express = require('express');
let cors = require('cors');

let payment = require('./routes/payment.js');
let editor = require('./routes/editor.js');
let hosting = require('./routes/hosting.js');
let publisher = require('./routes/publisher.js');
let transaction = require('./routes/transaction.js');
let plan = require('./routes/plan.js');
let server = require('./routes/server.js');
let middle = require('./routes/middle.js');
const Response = require('./utils/response.js');
const appBaseRoute = '/api';

let app = express();
app.use(cors());
app.options('*', cors());

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
 
sequelize.sync({logging: true}).then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Weblancer main express server now listening on port ${process.env.PORT}!`);
    });
});

import dotenv from './utils/loadDotEnv.js';
import { sequelize } from './models/models.js';
import { authorizeToken } from './acl/authorization.js';
import { unlessRoute } from './utils/utils.js';
import express from 'express';

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

console.log("index.js", 7)
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
 
sequelize.sync({logging: false}).then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Weblancer main express server now listening on port ${process.env.PORT}!`);
    });
});
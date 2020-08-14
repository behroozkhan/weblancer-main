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

console.log("index.js", 7)
let app = express();

app.use(express.json());
app.use(unlessRoute(['/test', '/', '/publisher/login', '/publisher/register'], authorizeToken));

app.use('/payment', payment);
app.use('/editor', editor);
app.use('/hosting', hosting);
app.use('/publisher', publisher);
app.use('/transaction', transaction);
app.use('/plan', plan);
app.use('/server', server);
app.use('/middle', middle);

app.get('/test', function (req, res) {
    res.json(
        new Response(true, {}, 
            "Tested Successfully"
        ).json()
    );
})

app.get('/', function (req, res) {
    console.log("WhiteLabel", req);
})
 
console.log("index.js", 8)
sequelize.sync({logging: true}).then(() => {
    console.log("index.js", 9)
    app.listen(process.env.PORT, () => {
        console.log(`Weblancer main express server now listening on port ${process.env.PORT}!`);
    });
});
import dotenv from './utils/loadDotEnv.js';
console.log("index.js", 1)
import { sequelize } from './models/models.js';
console.log("index.js", 2)
import { checkPermissions } from './acl/publisher-acl.js';
console.log("index.js", 3)
import { authorizeToken } from './acl/authorization.js';
console.log("index.js", 4)
import { unlessRoute } from './utils/utils.js';
console.log("index.js", 5)
import express from 'express';
console.log("index.js", 6)

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
app.use(unlessRoute(['/publisher/login', '/publisher/register'], authorizeToken));
app.use(unlessRoute(['/publisher/login', '/publisher/register'], checkPermissions));

app.use('/payment', payment);
app.use('/editor', editor);
app.use('/hosting', hosting);
app.use('/publisher', publisher);
app.use('/transaction', transaction);
app.use('/plan', plan);
app.use('/server', server);
app.use('/middle', middle);
 
console.log("index.js", 8)
sequelize.sync({logging: true}).then(() => {
    console.log("index.js", 9)
    app.listen(process.env.PORT, () => {
        console.log(`Weblancer main express server now listening on port ${process.env.PORT}!`);
    });
});
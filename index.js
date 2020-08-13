import dotenv from './utils/loadDotEnv.js';
import { sequelize } from './models/models.js';
import { checkPermissions } from './acl/publisher-acl.js';
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
 
sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Weblancer main express server now listening on port ${process.env.PORT}!`);
    });
});
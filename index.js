let { sequelize } = require('./models/models.js');
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

let app = express();
app.use(cors());

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
 
sequelize.sync({logging: true}).then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Weblancer main express server now listening on port ${process.env.PORT}!`);
    });
});
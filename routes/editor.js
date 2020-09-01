let express = require('express');
let router = express.Router();
let { getConfig } = require('../model-manager/models.js');
let moment = require('moment');
const Response = require('../utils/response.js');

router.post('/request', function (req, res) {
    // from publisher server to editor servers
    // set and return access token for a user in editor server
    let websiteId = req.body.websiteId;
    let publisherId = req.user.id;

    let publisherWebsite;
    try {
        publisherWebsite = await models.publisherWebsite.findOne({
            where: {
                endWebsiteId: websiteId
            }
        });

        if (!publisherWebsite) {
            res.status(410).json(
                new Response(false, {}, "Publisher website not found").json()
            );
            return;
        }
    } catch (e) {
        res.status(500).json(
            new Response(false, {}, "Publisher website not found").json()
        );
        return;
    }

    if (publisherWebsite.expireDate <= moment.utc()) {
        res.status(402).json(
            new Response(false, {}, "Plan expired").json()
        );
    }

    let editorServer = await models.Server.findOne({
        where: {
            type: 'editor'
        },
        order: [['cpuUsage', 'ASC'], ['memoryUsage', 'ASC'], ['storageUsage', 'ASC']],
    });

    if (!editorServer) {
        res.status(410).json(
            new Response(false, {}, "Editor server not found").json()
        );
    }

    // let editorRequestQuery = (await getConfig('EditorRequestQuery')).value;

    // TODO create long-process and handle all availables
    let longProcess = await models.LongProcess.create({
        name: 'Requesting Editor',
        refId: `${publisherId}_${publisherWebsite.endUserId}_${websiteId}`,
        status: 'Calling editor express server ...',
        state: 'called',
        timeout: 10 * 60
    });

    axios.post(`${editorServer.url}/api/request`, {
        publisherId, websiteId, publisherWebsite,
        longProcessId: longProcess.id,
        longProcessUrl: "https://whitelabel.weblancer.ir/api/long-process/update",
        longProcessToken: jwt.sign({id: 'longProcessToken'}, process.env.JWT_ACCESS_TOKEN_SECRET)
    })
    .then(function (response) {
        res.json(
            response.data
        );
    })
    .catch(function (error) {
        longProcess.message += '\n' + longProcess.status;
        longProcess.status = `calling publisher server error`;
        longProcess.state = 'failed';
        longProcess.metaData = {...longProcess.metaData, error};
        longProcess.endDate = moment().toDate();

        await longProcess.save();

        res.status(error.response.status).json(
            error.response.data
        );
    });
})

module.exports = router;
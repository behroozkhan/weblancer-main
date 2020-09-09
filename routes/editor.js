let express = require('express');
let router = express.Router();
let moment = require('moment');
const Response = require('../utils/response.js');
const { Op } = require("sequelize");
const { models } = require('../model-manager/models.js');

router.post('/request', async function (req, res) {
    // from publisher server to editor servers
    // set and return access token for a user in editor server
    let publisherId = req.user.id;

    let {websiteId} = req.body;

    let publisherWebsite;
    try {
        publisherWebsite = await models.PublisherWebSite.findOne({
            where: {
                endWebsiteId: websiteId
            }
        });

        if (!publisherWebsite) {
            res.status(410).json(
                new Response(false, {websiteId}, "Publisher website not found").json()
            );
            return;
        }
    } catch (e) {
        console.log(e);
        res.status(500).json(
            new Response(false, {}, "Publisher website not found").json()
        );
        return;
    }

    let oldLongProcess = await models.LongProcess.findOne({
        where: {
            name: 'Rewwquesting Editor',
            [Op.or]: [
                {state: 'called'},
                {state: 'running'}
            ],
            refId: `${publisherId}_${publisherWebsite.endUserId}_${websiteId}`
        },
        order: [['startDate', 'DESC']],
    });

    if (oldLongProcess) {
        let now = moment().utc()
        if (now.diff(oldLongProcess.startDate, 'seconds') <= oldLongProcess.timeout) {
            res.json(
                new Response(true, {longProcessId: oldLongProcess.id}).json()
            );
            return;
        } else {
            oldLongProcess.state = 'failed';
            oldLongProcess.message += oldLongProcess.status;
            oldLongProcess.status = 'Timeout !!!';

            await oldLongProcess.save();
        }
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
        return;
    }

    console.log("moment().utc().toDate()", moment().utc().toDate())
    let activePlanSell = await publisherWebsite.getPlan_sells();

    console.log("activePlanSell", activePlanSell);

    if (!activePlanSell) {
        res.status(402).json(
            new Response(false, {}, "Plan expired").json()
        );
        return;
    }

    
    res.status(402).json(
        new Response(false, {}, "Plan expired").json()
    );
    return;

    // TODO create long-process and handle all availables
    let longProcess = await models.LongProcess.create({
        name: 'Rewwquesting Editor',
        refId: `${publisherId}_${publisherWebsite.endUserId}_${websiteId}`,
        status: 'Calling editor express server ...',
        state: 'called',
        timeout: 10 * 60
    });

    let productDetails = activePlanSell.planObject.productDetails;
    let addedProducts = activePlanSell.websitePlanObject.addedProducts;

    delete publisherWebsite.metadata.siteData;
    
    console.log("Calling editor server ...", `${editorServer.url}/api/request`);
    axios.post(`${editorServer.url}/api/request`, {
        publisherId, websiteId, publisherWebsite, productDetails, addedProducts,
        longProcessData: {
            longProcessId: longProcess.id,
            longProcessUrl: "https://whitelabel.weblancer.ir/api/long-process/update",
            longProcessToken: jwt.sign({id: 'longProcessToken'}, process.env.JWT_ACCESS_TOKEN_SECRET)
        }
    })
    .then(function (response) {
        console.log("response", response);
        response.data.data.longProcessId = longProcess.id;
        res.json(
            response.data
        );
    })
    .catch(async function (error) {
        longProcess.message += '\n' + longProcess.status;
        longProcess.status = `calling publisher server error`;
        longProcess.state = 'failed';
        longProcess.metaData = {...longProcess.metaData, error};
        longProcess.endDate = moment().toDate();

        await longProcess.save();

        console.log('/editor/request error', error);

        res.status(error.response.status).json(
            error.response.data
        );
    });
})

module.exports = router;
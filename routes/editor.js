let express = require('express');
let router = express.Router();
let moment = require('moment');
const Response = require('../utils/response.js');
const { Op } = require("sequelize");

router.post('/request', async function (req, res) {
    // from publisher server to editor servers
    // set and return access token for a user in editor server
    let publisherId = req.user.id;

    let {websiteId} = req.body;

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
        console.log(e);
        res.status(500).json(
            new Response(false, {}, "Publisher website not found").json()
        );
        return;
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

    // TODO create long-process and handle all availables
    let longProcess = await models.LongProcess.create({
        name: 'Rewwquesting Editor',
        refId: `${publisherId}_${publisherWebsite.endUserId}_${websiteId}`,
        status: 'Calling editor express server ...',
        state: 'called',
        timeout: 10 * 60
    });

    let activePlanSell = await publisherWebsite.getPlan_sells({
        where: {
            [Op.and]: [
                { 
                    [Op.lte]: {
                        'startDate': moment().utc()
                    },
                    [Op.gte]: {
                        'expireDate': moment().utc()
                    }
                },
            ]
        },
        order: ['boughtDate', 'DESC'],
        limit: 1
    })[0];

    if (!activePlanSell) {
        res.status(402).json(
            new Response(false, {}, "Plan expired").json()
        );
        return;
    }

    let productDetails = activePlanSell.planObject.productDetails;
    let addedProducts = activePlanSell.websitePlanObject.addedProducts;

    delete publisherWebsite.metadata.siteData;
    
    axios.post(`${editorServer.url}/api/request`, {
        publisherId, websiteId, publisherWebsite, productDetails, addedProducts,
        longProcessData: {
            longProcessId: longProcess.id,
            longProcessUrl: "https://whitelabel.weblancer.ir/api/long-process/update",
            longProcessToken: jwt.sign({id: 'longProcessToken'}, process.env.JWT_ACCESS_TOKEN_SECRET)
        }
    })
    .then(function (response) {
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
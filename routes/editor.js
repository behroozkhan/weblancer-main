let express = require('express');
let router = express.Router();
let moment = require('moment');
const Response = require('../utils/response.js');
const { Op } = require("sequelize");
const { models } = require('../model-manager/models.js');
const axios = require('axios');
let jwt = require('jsonwebtoken');

router.post('/request', async function (req, res) {
    // from publisher server to editor servers
    // set and return access token for a user in editor server
    console.log("editor/request 1 ...");
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

    console.log("editor/request 2 ...");
    let oldLongProcess = await models.LongProcess.findOne({
        where: {
            name: 'Requesting Editor',
            [Op.or]: [
                {state: 'called'},
                {state: 'running'},
                {state: 'complete'}
            ],
            refId: `${publisherId}_${publisherWebsite.endUserId}_${websiteId}`
        },
        order: [['startDate', 'DESC']],
    });

    if (oldLongProcess) {
        let now = moment().utc();
        console.log("oldLongProcess", oldLongProcess.metaData, oldLongProcess.metaData.longProcessTimeout);
        if (oldLongProcess.state === 'complete' &&
            now.diff(oldLongProcess.startDate, 'seconds') <= oldLongProcess.metaData.longProcessTimeout) 
        {
            res.json(
                new Response(true, {longProcessId: oldLongProcess.id}).json()
            );
            return;
        }
        
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
    let activePlanSell = await publisherWebsite.getPlan_sells({
        where: {
            [Op.and]: [
                { 
                    startDate: {
                        [Op.lte]: moment().utc().toDate()
                    },
                },
                {
                    expireDate: {
                        [Op.gte]: moment().utc().toDate()
                    }
                },
            ]
        },
        order: [['boughtDate', 'DESC']],
        limit: 1
    });

    activePlanSell = activePlanSell[0];

    if (!activePlanSell) {
        res.status(402).json(
            new Response(false, {}, "Plan expired").json()
        );
        return;
    }

    let longProcess = await models.LongProcess.create({
        name: 'Requesting Editor',
        refId: `${publisherId}_${publisherWebsite.endUserId}_${websiteId}`,
        status: 'Calling editor express server ...',
        state: 'called',
        timeout: 10 * 60,
        metaData: {
            serverId: editorServer.id
        }
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

router.post('/publish', async function (req, res) {
    // from publisher server to editor servers
    // set and return access token for a user in editor server
    console.log("/publish 1");
    let publisherId = req.user.id;

    let {websiteId, username} = req.body;
    console.log("editor/publish", websiteId, username);

    let publisher;
    try {
        publisher = await models.Publisher.findOne({
            where: {
                id: publisherId
            }
        });

        if (!publisher) {
            res.status(410).json(
                new Response(false, {}, "Publisher not found").json()
            );
            return;
        }
    } catch (error) {
        res.status(500).json(
            new Response(false, {}, error).json()
        );
        return;
    }
    console.log("/publish 2");

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
    console.log("/publish 3");

    let oldLongProcess = await models.LongProcess.findOne({
        where: {
            name: 'Requesting Editor',
            state: 'complete',
            refId: `${publisherId}_${publisherWebsite.endUserId}_${websiteId}`
        },
        order: [['startDate', 'DESC']],
    });

    if (!oldLongProcess) {
        res.status(410).json(
            new Response(false, {}, "Editor not found").json()
        );
        return;
    }
    console.log("/publish 4");

    let oldPublishProcess = await models.LongProcess.findOne({
        where: {
            name: 'Publish Website',
            [Op.or]: [
                {state: 'called'},
                {state: 'running'}
            ],
            refId: `${publisherId}_${publisherWebsite.endUserId}_${websiteId}`
        },
        order: [['startDate', 'DESC']],
    });

    console.log("/publish 5");
    if (oldPublishProcess) {
        let now = moment().utc();
        console.log("oldPublishProcess", oldPublishProcess.metaData, oldPublishProcess.metaData.longProcessTimeout);
        if (oldPublishProcess.state === 'complete' &&
            now.diff(oldPublishProcess.startDate, 'seconds') <= oldPublishProcess.metaData.longProcessTimeout) 
        {
            res.json(
                new Response(true, {longProcessId: oldPublishProcess.id}).json()
            );
            return;
        }
        
        if (now.diff(oldPublishProcess.startDate, 'seconds') <= oldPublishProcess.timeout) {
            res.json(
                new Response(true, {longProcessId: oldPublishProcess.id}).json()
            );
            return;
        } else {
            oldPublishProcess.state = 'failed';
            oldPublishProcess.message += oldPublishProcess.status;
            oldPublishProcess.status = 'Timeout !!!';

            await oldPublishProcess.save();
        }
    }
    console.log("/publish 6");

    let editorServer = await models.Server.findOne({
        where: {
            id: oldLongProcess.metaData.serverId,
        }
    });

    if (!editorServer) {
        res.status(410).json(
            new Response(false, {}, "Editor server not found").json()
        );
        return;
    }
    console.log("/publish 7");

    let targetUrl;
    if (publisherWebsite.metadata && publisherWebsite.metadata.targetUrl)
        targetUrl = publisherWebsite.metadata.targetUrl;
    else {
        // TODO find best hoster server based on website has free plan or paid planed
        try {
            let hosterServer = await models.Server.findOne({
                where: {
                    type: 'hoster'
                },
                order: [['cpuUsage', 'ASC'], ['memoryUsage', 'ASC'], ['storageUsage', 'ASC']],
            });

            if (!hosterServer) {
                res.status(410).json(
                    new Response(false, {}, "Hoster server not found").json()
                );
                return;
            }

            targetUrl = `http://${hosterServer.ipAddress}:${
                editorServer.metadata.port || 80
            }/${hosterServer.metadata.hostUri}`;
        } catch (e) {
            console.log(e);
            res.status(500).json(
                new Response(false, {}, "Can't get hoster from db").json()
            );
            return;
        }
    }
    console.log("/publish 8");

    let longProcess = await models.LongProcess.create({
        name: 'Publish Website',
        refId: `${publisherId}_${publisherWebsite.endUserId}_${websiteId}`,
        status: 'Calling editor express server ...',
        state: 'called',
        timeout: 5 * 60,
        metaData: {
            serverId: editorServer.id
        }
    });
    
    console.log("/publish 9");
    console.log("Calling editor server ...", `${editorServer.url}/api/publish`);
    axios.post(`${editorServer.url}/api/publish`, {
        targetUrl, publisherWebsite: publisherWebsite.toJSON(), username,
        domainConfig: {
            domainData: publisherWebsite.domainData,
            publisherWebsiteDomain: publisher.publisherWebsiteDomain
        },
        longProcessData: {
            longProcessId: longProcess.id,
            longProcessUrl: "https://whitelabel.weblancer.ir/api/long-process/update",
            longProcessToken: jwt.sign({id: 'longProcessToken'}, process.env.JWT_ACCESS_TOKEN_SECRET)
        }
    })
    .then(function (response) {
        console.log("/publish 10");
        response.data.data.longProcessId = longProcess.id;
        res.json(
            response.data
        );
    })
    .catch(async function (error) {
        console.log("/publish 11");
        longProcess.message += '\n' + longProcess.status;
        longProcess.status = `publishing webite error`;
        longProcess.state = 'failed';
        longProcess.metaData = {...longProcess.metaData, error};
        longProcess.endDate = moment().toDate();

        await longProcess.save();

        console.log('/editor/publish error', error);

        res.status(error.response.status).json(
            error.response.data
        );
    });
})

router.post('/publishProcess', async function (req, res) {
    // from publisher server to editor servers
    // set and return access token for a user in editor server
    let publisherId = req.user.id;

    let {websiteId, username} = req.body;

    let publisher;
    try {
        publisher = await models.Publisher.findOne({
            where: {
                id: publisherId
            }
        });

        if (!publisher) {
            res.status(410).json(
                new Response(false, {}, "Publisher not found").json()
            );
            return;
        }
    } catch (error) {
        res.status(500).json(
            new Response(false, {}, error).json()
        );
        return;
    }

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

    try{
        let oldPublishProcess = await models.LongProcess.findOne({
            where: {
                name: 'Publish Website',
                [Op.or]: [
                    {state: 'called'},
                    {state: 'running'}
                ],
                refId: `${publisherId}_${publisherWebsite.endUserId}_${websiteId}`
            },
            order: [['startDate', 'DESC']],
        });
    
        if (oldPublishProcess) {
            let now = moment().utc();
            console.log("oldPublishProcess", oldPublishProcess.metaData, oldPublishProcess.metaData.longProcessTimeout);
            if (oldPublishProcess.state === 'complete' &&
                now.diff(oldPublishProcess.startDate, 'seconds') <= oldPublishProcess.metaData.longProcessTimeout) 
            {
                res.json(
                    new Response(true, {longProcessId: oldPublishProcess.id}).json()
                );
                return;
            }
            
            if (now.diff(oldPublishProcess.startDate, 'seconds') <= oldPublishProcess.timeout) {
                res.json(
                    new Response(true, {longProcessId: oldPublishProcess.id}).json()
                );
                return;
            } else {
                oldPublishProcess.state = 'failed';
                oldPublishProcess.message += oldPublishProcess.status;
                oldPublishProcess.status = 'Timeout !!!';
    
                await oldPublishProcess.save();
            }
        }
    
        res.json(
            new Response(true, {
            }).json()
        );
    } catch (error) {
        console.log("publishProcess", error);
        res.status(500).json(
            new Response(false, {}, "Error on publishProcess").json()
        );
        return;
    }
})

module.exports = router;
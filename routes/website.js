let express = require('express');
let router = express.Router();
let { models, sequelize } = require('../model-manager/models.js');
const WeblancerUtils = require('../utils/weblancerUtils.js');
const Response = require('../utils/response.js');
const fetch = require('node-fetch');

router.get('/', function (req, res) {
    // return all available websites
})

router.get('/:id', function (req, res) {
    // return website by id
})

router.post('/createorupdate', async function (req, res) {
    // creat or update new website

    let publisherId = req.user.id;

    // plan and websitePlan and type just need for creating new website and not for updating
    let {website, plan, websitePlan, type} = req.body;

    let publisherWebsite;

    try {
        publisherWebsite = await models.PublisherWebSite.findOne({
            where: {
                endWebsiteId: website.id,
                endUserId: website.userId,
                publisherId: publisherId
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).json(
            new Response(false, {e}, "Server error").json()
        );
        return;
    }

    let publisherWebsiteTemp = {
        name: website.name,
        displayName: website.displayName,
        description: website.description,
        serverIpAddress: website.serverIpAddress,
        url: website.url,
        metadata: {...website.metadata},
        data: {...website.data},
        type: type,
        endUserId: website.userId,
        endWebsiteId: website.id,
        publisherId: publisherId
    }

    if (!publisherWebsite) {
        // New website
        let transaction;
        try{
            // get transaction
            transaction = await sequelize.transaction();

            let newPublisherWebsite = await models.PublisherWebSite.create(publisherWebsiteTemp, 
                {transaction});

            await WeblancerUtils.createPlanSellAndSells(
                plan, websitePlan, newPublisherWebsite, publisherId, plan.hasTrial, transaction
            );
            
            await transaction.commit();

            res.json(
                new Response(true, {}).json()
            );
        } catch (e) {
            console.log(e);
            
            if (transaction) await transaction.rollback();

            res.status(500).json(
                new Response(false, {e}, "Can't create publisher website").json()
            );
            return;
        }
    } else { 
        // Update website
        try{
            await publisherWebsite.update(publisherWebsiteTemp);
            
            res.json(
                new Response(true, {}).json()
            );
        } catch (e) {
            console.log(e);
            res.status(500).json(
                new Response(false, {e}, "Can't update publisher website").json()
            );
            return;
        }
    }
})

router.post('/plan', async function (req, res) {
    // update a website to an specific plan
    let publisherId = req.user.id;
    let {website, oldPlan, plan, websitePlan, type, breakPlan} = req.body;

    let publisherWebsite;

    try {
        publisherWebsite = await models.PublisherWebSite.findOne({
            where: {
                name: website.name,
                endUserId: website.userId,
                publisherId: publisherId
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
            new Response(false, {e}, "Server error").json()
        );
        return;
    }

    let oldPlanSell = await publisherWebsite.getPlan_sells({
        order: ['boughtDate', 'DESC'],
        limit: 1
    })[0];

    if (!oldPlanSell) {
        res.status(500).json(
            new Response(false, {}, "Old plan sell not found").json()
        );
        return;
    }

    if (oldPlan.order > plan.order) {
        res.status(500).json(
            new Response(false, {}, "Can't upgrade website to lower plan").json()
        );
        return;
    }

    if (oldPlanSell.isTrial) {
        let transaction;
        try{
            // get transaction
            transaction = await sequelize.transaction();

            await oldPlanSell.update({
                upgradeDate: moment(websitePlan.boughtDate).toDate()
            }, {transaction});

            await WeblancerUtils.createPlanSellAndSells(
                plan, websitePlan, publisherWebsite, publisherId, false, transaction
            );
            
            await transaction.commit();

            res.json(
                new Response(true, {}).json()
            );
        } catch (e) {
            console.log(e);
            
            if (transaction) await transaction.rollback();

            res.status(500).json(
                new Response(false, {e}, "Can't update publisher website").json()
            );
            return;
        }
    } 
    else 
    {
        let transaction;
        try{
            // get transaction
            transaction = await sequelize.transaction();

            if (breakPlan) {
                await oldPlanSell.update({
                    upgradeDate: moment(websitePlan.boughtDate).toDate()
                }, {transaction});
            }
            else
            {
                await oldPlanSell.update({
                    upgradeDate: oldPlanSell.expireDate
                }, {transaction});
            }

            await WeblancerUtils.createPlanSellAndSells(
                plan, websitePlan, publisherWebsite, publisherId, false, transaction
            );
            
            await transaction.commit();

            res.json(
                new Response(true, {}).json()
            );
        } catch (e) {
            console.log(e);
            
            if (transaction) await transaction.rollback();

            res.status(500).json(
                new Response(false, {e}, "Can't update publisher website").json()
            );
            return;
        }
    }
})

router.post('/resolvestoragedns', async function (req, res) {
    let {domainConfig} = req.body;
    console.log("resolvestoragedns", domainConfig)

    try {
        let hosterServer = await models.Server.findOne({
            where: {
                type: 'hoster'
            },
            order: [['cpuUsage', 'ASC'], ['memoryUsage', 'ASC'], ['storageUsage', 'ASC']],
        });
    
        if (!hosterServer) {
            res.status(404).json(
                new Response(false, {}, "Hoster server not found").json()
            );
            return;
        }
    
        let targetUrl = `http://${hosterServer.ipAddress}:${
            hosterServer.metadata.port || 80
        }`;

        let form = new FormData();
        form.append("domainConfig", JSON.stringify(domainConfig));

        console.log("Calling", `${targetUrl}/cdn/resolvestoragedns`);

        let response = await fetch(`${targetUrl}/cdn/resolvestoragedns`, {
            method: 'post',
            body: data
        });

        response = await response.json();
        
        res.json(
            response.data
        );
    } catch (error) {
        console.log("resolvestoragedns error", error);
        res.status(500).json(
            new Response(false, {}, "resolvestoragedns error").json()
        );
    }
})

router.post('/', function (req, res) {
    // creat new website
})

router.put('/', function (req, res) {
    // update website
})

router.delete('/', function (req, res) {
    // delete website
})

module.exports = router;
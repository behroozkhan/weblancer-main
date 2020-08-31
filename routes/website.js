let express = require('express');
let router = express.Router();
let { models } = require('../model-manager/models.js');
const WeblancerUtils = require('../utils/weblancerUtils.js');
const Response = require('../utils/response.js');

router.get('/', function (req, res) {
    // return all available websites
})

router.get('/:id', function (req, res) {
    // return website by id
})

router.post('/createorupdate', async function (req, res) {
    // creat or update new website

    let publisherId = req.user.id;
    let {website, plan, websitePlan, type} = req.body;

    let publisher;
    try {
        publisher = await models.Publisher.findOne({
            where: {
                id: publisherId
            }
        });

        if (!publisher) {
            res.status(401).json(
                new Response(false, {}, "Username or password is wrong").json()
            );
            return;
        }
    } catch (e) {
        console.log(e);
        res.status(401).json(
            new Response(false, {}, "Username or password is wrong").json()
        );
        return;
    }

    let publisherWebsite;

    try {
        publisherWebsite = await models.PublisherWebSite.findOne({
            where: {
                name: website.name,
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
        metadata: website.metadata,
        boughtDate: websitePlan.boughtDate,
        planOrder: websitePlan.planOrder,
        planStartDate: websitePlan.boughtDate,
        expireDate: websitePlan.expireDate,
        metadata: {...website.metadata},
        type: type,
        endUserId: website.userId,
        endWebsiteId: website.id,
        totalPriceOfPlan: websitePlan.totalPriceOfPlan,
        totalPayForPlan: websitePlan.totalPayForPlan,
        productsDetail: plan.productsDetail,
        addedProducts: websitePlan.addedProducts,
        addedPrice: websitePlan.addedPrice,
        totalPrice: website.totalPrice,
        totalPayment: website.totalPayment,
        publisherId: publisherId
    }
    if (!publisherWebsite) {
        // New website
        try{
            let newPW = await models.PublisherWebSite.create(publisherWebsiteTemp);
            
            res.json(
                new Response(true, {}).json()
            );
        } catch (e) {
            console.log(e);
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
import {getConfig} from '../models/config.js';
import WeblancerUtils from '../utils/weblancerUtils.js';
import moment from 'moment';
import express from 'express';
import Response from './../utils/response.js';

let router = express.Router();

router.post('/publishrequest', async (req, res) => {
    // send a publish request to publisher server
})

router.post('/website/save', async (req, res) => {
    // editor sent jsondata to publisher to save website changes
})

router.post('/editorrequest', async (req, res) => {
    // editor sent jsondata to publisher to save website changes
    let websiteId = req.body.websiteId;
    let publisherId = req.body.publisherId;
    let publisherApiKey = req.body.publisherApiKey;

    let publisher;
    try {
        publisher = await models.Publisher.find({
            where: {
                id: publisherId,
                publisherApiKey: publisherApiKey
            },
            include: [models.PublisherWebsite, models.CreditTransaction]
        });
    } catch (e) {
        res.status(404).json(
            new Response(false, {}, "Publisher not found").json()
        );
        return;
    }

    let publisherWebsite;
    try {
        publisherWebsite = await models.publisherWebsite.findOne({
            where: {
                endWebsiteId: `${publisher.id}_${websiteId}`
            },
            includes: [models.Website],
            order: [['expireTime', 'DESC']]
        });
    } catch (e) {
        res.status(404).json(
            new Response(false, {}, "Publisher website not found").json()
        );
        return;
    }

    if (publisherWebsite.expireTime <= moment.utc()) {
        res.status(402).json(
            new Response(false, {}, "Plan expired").json()
        );
    }

    let editorServer = await models.Server.find({
        where: {
            type: 'editor'
        }
    });

    if (!editorServer) {
        res.status(404).json(
            new Response(false, {}, "Editor server not found").json()
        );
    }

    let editorRequestQuery = await getConfig('EditorRequestQuery').value;

    axios.post(`${editorServer.url}${editorRequestQuery.value}`, {
        publisherId, websiteId, publisherWebsite
    })
    .then(function (response) {
        res.json(
            response.data
        );
    })
    .catch(function (error) {
        res.status(error.response.status).json(
            error.response.data
        );
    });
})

export default router;
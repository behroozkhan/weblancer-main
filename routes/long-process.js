let express = require('express');
let router = express.Router();
let moment = require('moment');
const Response = require('../utils/response');
const { models } = require('../model-manager/models');

router.post('/update', async function (req, res) {
    console.log("long process update", req.body)
    let {
        longProcessId, status, state, metaData
    } = req.body;

    let longProcess;
    try {
        longProcess = await models.Publisher.findByPk(longProcessId);

        if (!longProcess) {
            res.status(404).json(
                new Response(false, {}, "LongProcess not found 1").json()
            );
            return;
        }
    } catch (error) {
        console.log("LongProcess update error", error)
        res.status(404).json(
            new Response(false, {}, "LongProcess not found 2").json()
        );
        return;
    }

    longProcess.message += '\n' + longProcess.status;
    longProcess.status = status;
    longProcess.state = state;

    if (state === 'complete' || state === 'failed')
        longProcess.endDate = moment().toDate();

    Object.keys(metaData).forEach(key => {
        longProcess.metaData[key] = metaData[key];
    });

    await longProcess.save();
    
    res.json(
        new Response(true).json()
    );
})

router.get('/getlaststartprocess', async function (req, res) {
    let {
        name
    } = req.body;
    
    let publisherId = req.user.id;

    let longProcess;
    try {
        longProcess = await models.Publisher.findOne({
            where: {
                refId: publisherId,
                name: 'Starting Publisher'
            },
            order: [
                ['startDate', 'DESC']
            ]
        });

        if (!longProcess) {
            res.status(410).json(
                new Response(false, {}, "LongProcess not found").json()
            );
            return;
        }
    } catch (error) {
        res.status(500).json(
            new Response(false, {}, error).json()
        );
        return;
    }

    if (longProcess.state === 'running') {
        let currDate = moment.now();
        let dateToTest = moment(longProcess.startDate);
        if (longProcess.timeout <= currDate.diff(dateToTest, 's')) {
            longProcess.state = 'failed';
            longProcess.message += '\n' + longProcess.status;
            longProcess.status = 'Process timeout !!!';
            await longProcess.save();
        }
    }

    if (longProcess.state === 'complete') {
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
            res.status(404).json(
                new Response(false, {}, error).json()
            );
            return;
        }

        publisher.expressPort = longProcess.metaData.expressPort;
        await publisher.save();
    }

    res.json(
        new Response(false, {longProcess: longProcess.toJSON()}).json()
    );
})

module.exports = router;
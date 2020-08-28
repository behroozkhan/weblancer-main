let express = require('express');
let router = express.Router();
let { getConfig } = require('../model-manager/models.js');

router.get('/', function (req, res) {
    // return all available configs
})

router.post('/getbykey', async function (req, res) {
    console.log('/getbykey');
    let {key} = req.body;

    if (!key) {
        res.status(400).json(
            new Response(false, {}, "Must send key in body").json()
        );
        return;
    }

    let configValue = await getConfig('WhiteLabelPotgresHost');

    res.json(
        new Response(false, {configValue}).json()
    );
})

router.get('/:id', function (req, res) {
    // return config by id
})

router.post('/', function (req, res) {
    // creat new config
})

router.put('/', function (req, res) {
    // update config
})

router.delete('/', function (req, res) {
    // delete config
})

module.exports = router;
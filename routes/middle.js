let { getConfig } = require('../model-manager/models.js');
let moment = require('moment');
let express = require('express');
const Response = require('../utils/response.js');
let router = express.Router();

router.post('/publishrequest', async (req, res) => {
    // send a publish request to publisher server
})

router.post('/website/save', async (req, res) => {
    // editor sent jsondata to publisher to save website changes
})

module.exports = router;

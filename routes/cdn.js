let express = require('express');
let router = express.Router();
let { models, sequelize } = require('../model-manager/models.js');
const WeblancerUtils = require('../utils/weblancerUtils.js');
const Response = require('../utils/response.js');
const axios = require('axios');

router.post('/cdnrecordexist', jsonParser, async (req, res) => {
    let {domain, subdomain} = req.body;

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

        console.log("Calling", `${targetUrl}/cdn/cdnrecordexist`);
        axios.post(`${targetUrl}/cdn/cdnrecordexist`, {
            domain, subdomain
        })
        .then(function (response) {
            console.log("dns record existance")
            res.json(
                response.data
            );
        })
        .catch(async function (error) {
            console.log("cdnrecordexist error", error);
            res.status(500).json(
                new Response(false, {}, "cdnrecordexist error").json()
            );
        });
    } catch (error) {
        console.log("cdnrecordexist error", error);
        res.status(500).json(
            new Response(false, {}, "cdnrecordexist error").json()
        );
    }
})

module.exports = router;
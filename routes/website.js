let express = require('express');
let router = express.Router();

router.get('/', function (req, res) {
    // return all available websites
})

router.get('/:id', function (req, res) {
    // return website by id
})

router.post('/createoradd', function (req, res) {
    // creat or update new website
    let {endUserId, endWebsiteId, resourcePlanId, permissionPlansId, planType, planOrder, metaData} =
        req.body;
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
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    // return all paymentSources
})

router.get('/mine', function (req, res) {
    // return all paymentSource of publisher
})

router.get('/:id', function (req, res) {
    // get paymentSource by id
})

router.post('/', function (req, res) {
    // creat new paymentSource
})

router.put('/', function (req, res) {
    // update paymentSource
})

router.delete('/', function (req, res) {
    // delete paymentSource
})

module.exports = router;
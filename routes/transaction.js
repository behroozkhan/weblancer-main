let express = require('express');
let router = express.Router();

router.get('/', function (req, res) {
    // return all available transactions
})

router.get('/publisher/:id', function (req, res) {
    // return all transaction of publisher id
})

router.get('/:id', function (req, res) {
    // return transaction by id
})

router.post('/', function (req, res) {
    // creat new transaction
})

router.put('/', function (req, res) {
    // update transaction
})

router.delete('/', function (req, res) {
    // delete transaction
})

module.exports = router;
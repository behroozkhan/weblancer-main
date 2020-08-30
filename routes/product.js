let express = require('express');
let router = express.Router();

router.get('/', function (req, res) {
    // return all available products
})

router.get('/:id', function (req, res) {
    // return product by id
})

router.post('/', function (req, res) {
    // creat new product
})

router.put('/', function (req, res) {
    // update product
})

router.delete('/', function (req, res) {
    // delete product
})

module.exports = router;
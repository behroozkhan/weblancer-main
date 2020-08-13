import express from 'express';
var router = express.Router();

router.get('/', function (req, res) {
    // return all available configs
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
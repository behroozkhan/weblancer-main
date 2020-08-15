let express = require('express');
let router = express.Router();

router.get('/', function (req, res) {
    // return all servers
})

router.get('/type/:type', function (req, res) {
    // return all server by type
})

router.get('/:id', function (req, res) {
    // get server by id
})

router.post('/', function (req, res) {
    // creat new server
})

router.put('/', function (req, res) {
    // update server
})

router.delete('/', function (req, res) {
    // delete server
})

router.get('/lower/:type', function (req, res) {
    // return lower usage server by type
})

module.exports = router;
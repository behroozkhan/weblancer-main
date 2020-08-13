'use strict';

var _config = require('../models/config.js');

var _weblancerUtils = require('../utils/weblancerUtils.js');

var _weblancerUtils2 = _interopRequireDefault(_weblancerUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require('express');
var router = express.Router();
var moment = require('moment');

router.post('/publishrequest', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}()
// send a publish request to publisher server
);

router.post('/website/save', function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}()
// editor sent jsondata to publisher to save website changes
);

router.post('/editorrequest', function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
        var websiteId, publisherId, publisherApiKey, publisher, publisherWebsite, editorServer, editorRequestQuery;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        // editor sent jsondata to publisher to save website changes
                        websiteId = req.body.websiteId;
                        publisherId = req.body.publisherId;
                        publisherApiKey = req.body.publisherApiKey;
                        publisher = void 0;
                        _context3.prev = 4;
                        _context3.next = 7;
                        return models.Publisher.find({
                            where: {
                                id: publisherId,
                                publisherApiKey: publisherApiKey
                            },
                            include: [models.PublisherWebsite, models.CreditTransaction]
                        });

                    case 7:
                        publisher = _context3.sent;
                        _context3.next = 14;
                        break;

                    case 10:
                        _context3.prev = 10;
                        _context3.t0 = _context3['catch'](4);

                        res.status(404).json(new Response(false, {}, "Publisher not found").json());
                        return _context3.abrupt('return');

                    case 14:
                        publisherWebsite = void 0;
                        _context3.prev = 15;
                        _context3.next = 18;
                        return models.publisherWebsite.findOne({
                            where: {
                                endWebsiteId: publisher.id + '_' + websiteId
                            },
                            includes: [models.Website],
                            order: [['expireTime', 'DESC']]
                        });

                    case 18:
                        publisherWebsite = _context3.sent;
                        _context3.next = 25;
                        break;

                    case 21:
                        _context3.prev = 21;
                        _context3.t1 = _context3['catch'](15);

                        res.status(404).json(new Response(false, {}, "Publisher website not found").json());
                        return _context3.abrupt('return');

                    case 25:

                        if (publisherWebsite.expireTime <= moment.utc()) {
                            res.status(402).json(new Response(false, {}, "Plan expired").json());
                        }

                        _context3.next = 28;
                        return models.Server.find({
                            where: {
                                type: 'editor'
                            }
                        });

                    case 28:
                        editorServer = _context3.sent;


                        if (!editorServer) {
                            res.status(404).json(new Response(false, {}, "Editor server not found").json());
                        }

                        _context3.next = 32;
                        return (0, _config.getConfig)('EditorRequestQuery');

                    case 32:
                        editorRequestQuery = _context3.sent;


                        axios.post('' + editorServer.url + editorRequestQuery, {
                            publisherId: publisherId, websiteId: websiteId, publisherWebsite: publisherWebsite
                        }).then(function (response) {
                            res.json(response.data);
                        }).catch(function (error) {
                            res.status(error.response.status).json(error.response.data);
                        });

                    case 34:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined, [[4, 10], [15, 21]]);
    }));

    return function (_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}());

module.exports = router;
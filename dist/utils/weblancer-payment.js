'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.paymentReverse = exports.paymentVerfiy = exports.paymentInit = undefined;

var paymentInit = exports.paymentInit = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(publisherId, amount, gateway, resNum, additionalData1, initData, onSuccess, onError) {
        var publisherPaymentSource, paymentSourceWhere, sourceData, paymentTransaction, publisher;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        // TODO sep payment setup
                        // TODO move all type of payments to another library

                        publisherPaymentSource = {};
                        paymentSourceWhere = { publisherId: publisherId };

                        gateway ? paymentSourceWhere.gateway = gateway : paymentSourceWhere.isDefault = true;
                        _context2.prev = 3;
                        _context2.next = 6;
                        return _models2.default.PaymentSource.find({
                            where: paymentSourceWhere
                        });

                    case 6:
                        publisherPaymentSource = _context2.sent;
                        _context2.next = 11;
                        break;

                    case 9:
                        _context2.prev = 9;
                        _context2.t0 = _context2['catch'](3);

                    case 11:
                        sourceData = void 0;

                        if (initData.endUserId) {
                            if (publisherPaymentSource) sourceData = publisherPaymentSource.data;
                        }

                        if (sourceData) {
                            _context2.next = 20;
                            break;
                        }

                        _context2.next = 16;
                        return (0, _config2.default)("WeblancerSourceData");

                    case 16:
                        sourceData = _context2.sent;

                        if (sourceData) {
                            _context2.next = 20;
                            break;
                        }

                        onError(404, new Response(false, {}, "Can't get configs from db").json());
                        return _context2.abrupt('return');

                    case 20:
                        paymentTransaction = void 0;
                        _context2.prev = 21;
                        _context2.next = 24;
                        return _models2.default.PaymentTransaction.create({
                            gateway: gateway,
                            resNum: resNum,
                            amount: amount,
                            initData: initData,
                            authorType: initData.endUserId ? 'endUser' : 'publisher',
                            authorId: initData.endUserId || publisherId,
                            sourceType: publisherPaymentSource ? 'publisher' : 'weblancer',
                            weblancerState: 'init'
                        });

                    case 24:
                        paymentTransaction = _context2.sent;
                        _context2.next = 31;
                        break;

                    case 27:
                        _context2.prev = 27;
                        _context2.t1 = _context2['catch'](21);

                        onError(500, new Response(false, {}, "Can't create paymentTransaction").json());
                        return _context2.abrupt('return');

                    case 31:
                        publisher = void 0;
                        _context2.prev = 32;
                        _context2.next = 35;
                        return _models2.default.Publisher.find({
                            where: {
                                id: publisherId
                            },
                            include: [_models2.default.PaymentTransaction]
                        });

                    case 35:
                        publisher = _context2.sent;


                        publisher.paymentTransactions.push(paymentTransaction);
                        _context2.next = 39;
                        return publisher.save({ fields: ['paymentTransactions'] });

                    case 39:
                        _context2.next = 45;
                        break;

                    case 41:
                        _context2.prev = 41;
                        _context2.t2 = _context2['catch'](32);

                        onError(500, new Response(false, {}, "Can't get or update publisher").json());
                        return _context2.abrupt('return');

                    case 45:

                        _axios2.default.post(paymentServiceUrl + '/initpayment', {
                            sourceData: sourceData, amount: amount, resNum: resNum
                        }).then(function (token) {
                            paymentTransaction.weblancerState = 'userPayment';
                            paymentTransaction.redirectToken = token;
                            paymentTransaction.paymentUrl = paymentUrl;
                            paymentTransaction.save({ fields: ['weblancerState', 'redirectToken'] }).then(function () {
                                onSuccess(new Response(true, { token: token, paymentUrl: paymentUrl, paymentTransaction: paymentTransaction }).json());
                            }).catch(function (error) {
                                onError(500, new Response(false, {}, "Can't save paymentTransaction").json());
                            });
                        }).catch(function () {
                            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(error) {
                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                paymentTransaction.weblancerState = 'error';
                                                paymentTransaction.message = 'Got error from payment service at /initpayment: ' + error.message;
                                                _context.next = 4;
                                                return paymentTransaction.save({ fields: ['weblancerState', 'message'] });

                                            case 4:
                                                onError(500, new Response(false, {}, error.message).json());

                                            case 5:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, this);
                            }));

                            return function (_x9) {
                                return _ref2.apply(this, arguments);
                            };
                        }());

                    case 46:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[3, 9], [21, 27], [32, 41]]);
    }));

    return function paymentInit(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8) {
        return _ref.apply(this, arguments);
    };
}();

var paymentVerfiy = exports.paymentVerfiy = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(paymentResponse, onSuccess, onError) {
        var resNum, refNum, paymentTransaction, paymentServiceUrl;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        resNum = paymentResponse.resNum;
                        refNum = paymentResponse.refNum;
                        paymentTransaction = void 0;
                        _context5.prev = 3;
                        _context5.next = 6;
                        return _models2.default.PaymentTransaction.find({
                            where: {
                                resNum: resNum
                            }
                        });

                    case 6:
                        paymentTransaction = _context5.sent;
                        _context5.next = 13;
                        break;

                    case 9:
                        _context5.prev = 9;
                        _context5.t0 = _context5['catch'](3);

                        onError(404, new Response(false, {}, "Can't find paymentTransaction").json());
                        return _context5.abrupt('return');

                    case 13:

                        paymentTransaction.weblancerState = 'verifying';
                        paymentTransaction.paymentResponse = paymentResponse;
                        _context5.prev = 15;
                        _context5.next = 18;
                        return paymentTransaction.save({ fields: ['weblancerState', 'paymentResponse'] });

                    case 18:
                        _context5.next = 24;
                        break;

                    case 20:
                        _context5.prev = 20;
                        _context5.t1 = _context5['catch'](15);

                        onError(500, new Response(false, {}, "Can't save paymentTransaction").json());
                        return _context5.abrupt('return');

                    case 24:
                        _context5.next = 26;
                        return (0, _config2.default)("PaymentServiceUrl");

                    case 26:
                        paymentServiceUrl = _context5.sent;

                        if (paymentServiceUrl) {
                            _context5.next = 30;
                            break;
                        }

                        onError(404, new Response(false, {}, "Can't get configs from db").json());
                        return _context5.abrupt('return');

                    case 30:

                        _axios2.default.post(paymentServiceUrl + '/verifypayment', {
                            refNum: refNum, MID: MID, amount: paymentTransaction.amount, gateway: paymentTransaction.gateway
                        }).then(function () {
                            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(message) {
                                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                    while (1) {
                                        switch (_context3.prev = _context3.next) {
                                            case 0:
                                                paymentTransaction.weblancerState = 'complete';
                                                paymentTransaction.message = message;
                                                _context3.next = 4;
                                                return paymentTransaction.save({ fields: ['weblancerState', 'message'] });

                                            case 4:
                                                onSuccess(paymentTransaction);

                                            case 5:
                                            case 'end':
                                                return _context3.stop();
                                        }
                                    }
                                }, _callee3, this);
                            }));

                            return function (_x13) {
                                return _ref4.apply(this, arguments);
                            };
                        }()).catch(function () {
                            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(error) {
                                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                    while (1) {
                                        switch (_context4.prev = _context4.next) {
                                            case 0:
                                                paymentTransaction.weblancerState = 'error';
                                                paymentTransaction.message = 'Got error from payment service at /verfiypayment: ' + error.message;
                                                _context4.next = 4;
                                                return paymentTransaction.save({ fields: ['weblancerState', 'message'] });

                                            case 4:
                                                onError(500, new Response(false, {}, error.message).json());

                                            case 5:
                                            case 'end':
                                                return _context4.stop();
                                        }
                                    }
                                }, _callee4, this);
                            }));

                            return function (_x14) {
                                return _ref5.apply(this, arguments);
                            };
                        }());

                    case 31:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, this, [[3, 9], [15, 20]]);
    }));

    return function paymentVerfiy(_x10, _x11, _x12) {
        return _ref3.apply(this, arguments);
    };
}();

var paymentReverse = exports.paymentReverse = function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, this);
    }));

    return function paymentReverse() {
        return _ref6.apply(this, arguments);
    };
}();

var _config = require('../models/config.js');

var _config2 = _interopRequireDefault(_config);

var _models = require('../models/models.js');

var _models2 = _interopRequireDefault(_models);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
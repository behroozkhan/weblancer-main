'use strict';

var _utils = require('../utils/utils.js');

var _utils2 = _interopRequireDefault(_utils);

var _weblancerPayment = require('../utils/weblancer-payment.js');

var _weblancerUtils = require('../utils/weblancerUtils.js');

var _weblancerUtils2 = _interopRequireDefault(_weblancerUtils);

var _models = require('../models/models.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var moment = require('moment');
var models = require('models');
var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');

router.get('/publisher', function (req, res) {
    // return all publishers
    findAndCountAll(req, res, models.Publisher);
});

router.get('/:id', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
        var id;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        // return publisher by id
                        id = req.params.id;

                        models.Publisher.find({
                            where: {
                                id: id
                            }
                        }).then(function (publisher) {
                            if (!publisher) {
                                res.status(404).json(new Response(false, {}, "Publisher not found").json());
                                return;
                            }

                            res.json(new Response(true, {
                                publisher: publisher
                            }).json());
                        }).catch(function (error) {
                            res.status(500).json(new Response(false, {}, error.message).json());
                        });

                    case 2:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}());

router.post('/', function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
        var username, password, subDomain;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        // add new publisher
                        username = req.body.username;
                        password = req.body.password;
                        subDomain = req.body.username + (0, _utils2.default)(10, 99);


                        models.Publisher.create({
                            username: username,
                            password: password,
                            subDomain: subDomain
                        }).then(function (newPublisher) {
                            res.json(new Response(true, {
                                publisher: newPublisher
                            }).json());
                        }).catch(function (error) {
                            res.status(500).json(new Response(false, {}, error.message).json());
                        });

                    case 4:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}());

router.put('/:id', function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
        var _publisher$update;

        var id, publisher, firstName, lastName, nationalCode, email, mobile, webhookUrls, personalStyle, customDomains, subDomain;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        // update publisher data
                        id = req.params.id;
                        publisher = void 0;
                        _context3.prev = 2;
                        _context3.next = 5;
                        return models.publisher.find({
                            where: {
                                id: id
                            }
                        });

                    case 5:
                        publisher = _context3.sent;
                        _context3.next = 12;
                        break;

                    case 8:
                        _context3.prev = 8;
                        _context3.t0 = _context3['catch'](2);

                        res.status(404).json(new Response(false, {}, "Publisher not found").json());
                        return _context3.abrupt('return');

                    case 12:
                        firstName = req.body.firstName || publisher.firstName;
                        lastName = req.body.lastName || publisher.lastName;
                        nationalCode = req.body.nationalCode || publisher.nationalCode;
                        email = req.body.email || publisher.email;
                        mobile = req.body.mobile || publisher.mobile;
                        webhookUrls = req.body.webhookUrls || publisher.webhookUrls;
                        personalStyle = req.body.personalStyle || publisher.personalStyle;
                        customDomains = req.body.customDomains || publisher.customDomains;
                        subDomain = req.body.subDomain || publisher.subDomain;


                        publisher.update((_publisher$update = {
                            firstName: firstName,
                            lastName: lastName,
                            nationalCode: nationalCode,
                            email: email
                        }, _defineProperty(_publisher$update, 'email', email), _defineProperty(_publisher$update, 'mobile', mobile), _defineProperty(_publisher$update, 'webhookUrls', webhookUrls), _defineProperty(_publisher$update, 'personalStyle', personalStyle), _defineProperty(_publisher$update, 'customDomains', customDomains), _defineProperty(_publisher$update, 'subDomain', subDomain), _publisher$update)).success(function (result) {
                            res.json(new Response(true, publisher).json());
                        });

                    case 22:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined, [[2, 8]]);
    }));

    return function (_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}());

router.delete('/:id', function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function (_x7, _x8) {
        return _ref4.apply(this, arguments);
    };
}()
// delete publisher
// TODO comming soon
);

router.post('/paymentinit', function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
        var publisherId, amount, gateway, resNum, endUserId, paymentData, additionalData1, paymentTransaction;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        // charge requeted by publisher
                        // setup payment url and redirect publisher
                        publisherId = req.user.id || req.body.publisherId;
                        amount = req.body.amount;
                        gateway = req.body.gateway;
                        resNum = req.body.resNum || (0, _utils2.default)(50);
                        endUserId = req.body.endUserId;
                        paymentData = req.body.paymentData;
                        additionalData1 = req.user.id;
                        _context5.next = 9;
                        return _weblancerUtils2.default.getPaymentTransactionExist(resNum);

                    case 9:
                        paymentTransaction = _context5.sent;

                        if (!paymentTransaction) {
                            _context5.next = 13;
                            break;
                        }

                        res.json(new Response(true, {
                            paymentTransaction: paymentTransaction
                        }).json());
                        return _context5.abrupt('return');

                    case 13:

                        (0, _weblancerPayment.paymentInit)(publisherId, amount, gateway, resNum, additionalData1, { endUserId: endUserId, paymentData: paymentData }, function (successResponse) {
                            res.json(successResponse);
                        }, function (errorStatusCode, errorResponse) {
                            res.status(errorStatusCode).json(errorResponse);
                        });

                    case 14:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function (_x9, _x10) {
        return _ref5.apply(this, arguments);
    };
}());

router.post('/paymentverify', function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res) {
        var paymentResponse, publisher, paymentTransaction;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        // verify payment and charge publisher
                        paymentResponse = req.body.paymentResponse;
                        publisher = void 0;
                        _context7.prev = 2;
                        _context7.next = 5;
                        return models.Publisher.find({
                            where: {
                                id: req.user.id
                            }
                        });

                    case 5:
                        publisher = _context7.sent;
                        _context7.next = 12;
                        break;

                    case 8:
                        _context7.prev = 8;
                        _context7.t0 = _context7['catch'](2);

                        res.status(500).json(new Response(false, {}, "Can't get publisher").json());
                        return _context7.abrupt('return');

                    case 12:
                        _context7.next = 14;
                        return _weblancerUtils2.default.getPaymentTransactionExist(resNum);

                    case 14:
                        paymentTransaction = _context7.sent;

                        if (!(paymentTransaction && paymentTransaction.weblancerState === 'complete')) {
                            _context7.next = 18;
                            break;
                        }

                        res.json(new Response(true, {
                            newCredit: publisher.credit,
                            amount: paymentTransaction.amount
                        }, message));
                        return _context7.abrupt('return');

                    case 18:

                        (0, _weblancerPayment.paymentVerfiy)(paymentResponse, function () {
                            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(paymentTransaction) {
                                var transaction, creditTransaction;
                                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                                    while (1) {
                                        switch (_context6.prev = _context6.next) {
                                            case 0:
                                                // onSuccess
                                                transaction = void 0;
                                                _context6.prev = 1;

                                                if (!(paymentTransaction.sourceType === 'weblancer')) {
                                                    _context6.next = 15;
                                                    break;
                                                }

                                                _context6.next = 5;
                                                return _models.sequelize.transaction();

                                            case 5:
                                                transaction = _context6.sent;
                                                _context6.next = 8;
                                                return models.CreditTransaction.create({
                                                    amount: paymentTransaction.amount,
                                                    useType: paymentTransaction.initData.endUserId ? 'userPayment' : 'publisherPayment',
                                                    description: { publisherId: publisher.id, endUserId: paymentTransaction.initData.endUserId },
                                                    resNum: paymentTransaction.resNum
                                                }, { transaction: transaction });

                                            case 8:
                                                creditTransaction = _context6.sent;


                                                publisher.credit += paymentTransaction.amount;
                                                publisher.creditTransactions.push(creditTransaction);

                                                _context6.next = 13;
                                                return publisher.save({ fields: ['credit', 'creditTransactions'], transaction: transaction });

                                            case 13:
                                                _context6.next = 15;
                                                return transaction.commit();

                                            case 15:

                                                res.json(new Response(true, {
                                                    newCredit: publisher.credit,
                                                    amount: paymentTransaction.amount,
                                                    paymentTransaction: paymentTransaction
                                                }, paymentTransaction.message));
                                                _context6.next = 24;
                                                break;

                                            case 18:
                                                _context6.prev = 18;
                                                _context6.t0 = _context6['catch'](1);

                                                if (!transaction) {
                                                    _context6.next = 23;
                                                    break;
                                                }

                                                _context6.next = 23;
                                                return transaction.rollback();

                                            case 23:

                                                res.status(500).json(new Response(false, {}, _context6.t0.message).json());

                                            case 24:
                                            case 'end':
                                                return _context6.stop();
                                        }
                                    }
                                }, _callee6, undefined, [[1, 18]]);
                            }));

                            return function (_x13) {
                                return _ref7.apply(this, arguments);
                            };
                        }(), function (errorStatusCode, errorResponse) {
                            res.status(errorStatusCode).json(errorResponse);
                        });

                    case 19:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, undefined, [[2, 8]]);
    }));

    return function (_x11, _x12) {
        return _ref6.apply(this, arguments);
    };
}());

router.post('/plan/:id', function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res) {
        var planId, publisher, plan, backMoney, planTime, totalPriceOfPlan, creditNeed, boughtDate, expireDate, totalPayForPlan, transaction, publisherPlan, creditTransaction, oldPublisherPlan;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        // set new plan for publisher
                        planId = res.params.id;
                        publisher = void 0;
                        _context8.prev = 2;
                        _context8.next = 5;
                        return models.Publisher.find({
                            where: {
                                id: req.user.id
                            },
                            include: [models.PublisherPlan, models.CreditTransaction]
                        });

                    case 5:
                        publisher = _context8.sent;
                        _context8.next = 12;
                        break;

                    case 8:
                        _context8.prev = 8;
                        _context8.t0 = _context8['catch'](2);

                        res.status(404).json(new Response(false, {}, "Publisher not found").json());
                        return _context8.abrupt('return');

                    case 12:
                        plan = void 0;
                        _context8.prev = 13;
                        _context8.next = 16;
                        return models.Plan.find({
                            where: {
                                id: planId
                            }
                        });

                    case 16:
                        plan = _context8.sent;
                        _context8.next = 23;
                        break;

                    case 19:
                        _context8.prev = 19;
                        _context8.t1 = _context8['catch'](13);

                        res.status(404).json(new Response(false, {}, "Plan not found").json());
                        return _context8.abrupt('return');

                    case 23:
                        if (!(publisher.publisherPlan.plan.order > plan.order)) {
                            _context8.next = 26;
                            break;
                        }

                        res.status(403).json(new Response(false, {}, "Can't downgrade plan").json());
                        return _context8.abrupt('return');

                    case 26:
                        backMoney = _weblancerUtils2.default.getBackMoney(publisher.publisherPlan);
                        planTime = req.body.planTime;
                        totalPriceOfPlan = planTime === 'monthly' ? plan.priceMonthly : plan.priceMonthly * 12;
                        creditNeed = (planTime === 'monthly' ? plan.offPriceMonthly || plan.priceMonthly : plan.offpriceYearly || plan.priceYearly) - backMoney;

                        // TODO Apply copouns

                        if (!(publisher.credit - creditNeed < publisher.minCredit)) {
                            _context8.next = 33;
                            break;
                        }

                        res.status(402).json(new Response(false, {
                            creditNeed: creditNeed - publisher.credit - publisher.minCredit
                        }, "Not enough credit").json());
                        return _context8.abrupt('return');

                    case 33:

                        publisher.credit -= creditNeed;

                        boughtDate = moment.utc();
                        expireDate = planTime === 'monthly' ? moment.utc().add(1, 'M') : moment.utc().add(1, 'y');
                        totalPayForPlan = creditNeed + backMoney;
                        transaction = void 0;
                        _context8.prev = 38;
                        _context8.next = 41;
                        return _models.sequelize.transaction();

                    case 41:
                        transaction = _context8.sent;
                        _context8.next = 44;
                        return models.PublisherPlan.create({
                            boughtDate: boughtDate, expireDate: expireDate, totalPriceOfPlan: totalPriceOfPlan, totalPayForPlan: totalPayForPlan, plan: plan
                        }, {
                            include: [models.Plan],
                            transaction: transaction
                        });

                    case 44:
                        publisherPlan = _context8.sent;
                        _context8.next = 47;
                        return models.CreditTransaction.create({
                            amount: creditNeed,
                            useType: 'plan',
                            description: { planName: plan.name }
                        }, { transaction: transaction });

                    case 47:
                        creditTransaction = _context8.sent;


                        publisher.creditTransactions.push(creditTransaction);

                        oldPublisherPlan = publisher.publisherPlan;

                        if (!(oldPublisherPlan && oldPublisherPlan.expireTime > moment.utc())) {
                            _context8.next = 55;
                            break;
                        }

                        oldPublisherPlan.upgradedToUpperPlan = true;
                        oldPublisherPlan.expireTime = moment.utc();
                        _context8.next = 55;
                        return oldPublisherPlan.save({ fields: ['upgradedToUpperPlan', 'expireTime'], transaction: transaction });

                    case 55:

                        publisher.publisherPlan = publisherPlan;
                        _context8.next = 58;
                        return publisher.save({ fields: ['publisherPlan', 'credit', 'creditTransaction'], transaction: transaction });

                    case 58:
                        _context8.next = 60;
                        return transaction.commit();

                    case 60:

                        res.json(new Response(true, {
                            newCredit: publisher.credit,
                            newPublisherPlan: publisherPlan
                        }).json());
                        _context8.next = 69;
                        break;

                    case 63:
                        _context8.prev = 63;
                        _context8.t2 = _context8['catch'](38);

                        if (!transaction) {
                            _context8.next = 68;
                            break;
                        }

                        _context8.next = 68;
                        return transaction.rollback();

                    case 68:

                        res.status(500).json(new Response(false, {}, _context8.t2.message).json());

                    case 69:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, undefined, [[2, 8], [13, 19], [38, 63]]);
    }));

    return function (_x14, _x15) {
        return _ref8.apply(this, arguments);
    };
}());

router.post('/createwebsite', function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(req, res) {
        var endUserId, websiteId, resourcePlanId, permissionPlansId, planTime, planOrder, metadata, websiteType, publisher, _WeblancerUtils$resol, resourcePlan, permissionPlans, totalPriceOfPlan, creditNeed, currentPublisherWebsite, _backMoney, boughtDate, expireDate, totalPayForPlan, transaction, publisherWebsite, description, creditTransaction;

        return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        // create website and reduce charge from publisher
                        endUserId = req.body.endUserId;
                        websiteId = req.body.websiteId;
                        resourcePlanId = req.body.resourcePlanId;
                        permissionPlansId = req.body.permissionPlansId;
                        planTime = req.body.planTime;
                        planOrder = req.body.planOrder;
                        metadata = req.body.metadata;
                        websiteType = req.body.websiteType;
                        publisher = void 0;
                        _context9.prev = 9;
                        _context9.next = 12;
                        return models.Publisher.find({
                            where: {
                                id: req.user.id
                            },
                            include: [models.PublisherWebsite, models.CreditTransaction]
                        });

                    case 12:
                        publisher = _context9.sent;
                        _context9.next = 19;
                        break;

                    case 15:
                        _context9.prev = 15;
                        _context9.t0 = _context9['catch'](9);

                        res.status(404).json(new Response(false, {}, "Publisher not found").json());
                        return _context9.abrupt('return');

                    case 19:
                        _WeblancerUtils$resol = _weblancerUtils2.default.resolveWebsitePlans(resourcePlanId, permissionPlansId), resourcePlan = _WeblancerUtils$resol.resourcePlan, permissionPlans = _WeblancerUtils$resol.permissionPlans;

                        if (resourcePlan) {
                            _context9.next = 23;
                            break;
                        }

                        res.status(404).json(new Response(false, {}, "Website plans not found").json());
                        return _context9.abrupt('return');

                    case 23:
                        totalPriceOfPlan = _weblancerUtils2.default.getTotalPriceOfPlan(resourcePlan, planTime, publisher.hasOwnHostServer);
                        creditNeed = _weblancerUtils2.default.getCreditNeed(resourcePlan, planTime, publisher.hasOwnHostServer);


                        permissionPlans.forEach(function (permissionPlan) {
                            totalPriceOfPlan += _weblancerUtils2.default.getTotalPriceOfPlan(permissionPlan, planTime, publisher.hasOwnHostServer);

                            creditNeed += _weblancerUtils2.default.getCreditNeed(permissionPlan, planTime, publisher.hasOwnHostServer);
                        });

                        currentPublisherWebsite = void 0;
                        _context9.prev = 27;
                        _context9.next = 30;
                        return models.PublisherWebsite.find({
                            where: {
                                endWebsiteId: publisher.id + '_' + websiteId
                            }
                        });

                    case 30:
                        currentPublisherWebsite = _context9.sent;
                        _context9.next = 35;
                        break;

                    case 33:
                        _context9.prev = 33;
                        _context9.t1 = _context9['catch'](27);

                    case 35:
                        if (currentPublisherWebsite) {
                            _backMoney = _weblancerUtils2.default.getBackMoney(currentPublisherWebsite);


                            creditNeed -= _backMoney;
                        }

                        if (!(currentPublisherWebsite.planOrder > planOrder)) {
                            _context9.next = 39;
                            break;
                        }

                        res.status(403).json(new Response(false, {}, "Can't downgrade plan").json());
                        return _context9.abrupt('return');

                    case 39:
                        if (!(publisher.credit - creditNeed < publisher.minCredit)) {
                            _context9.next = 42;
                            break;
                        }

                        res.status(402).json(new Response(false, {
                            creditNeed: creditNeed - publisher.credit - publisher.minCredit
                        }, "Not enough credit").json());
                        return _context9.abrupt('return');

                    case 42:

                        publisher.credit -= creditNeed;

                        boughtDate = moment.utc();
                        expireDate = planTime === 'monthly' ? moment.utc().add(1, 'M') : moment.utc().add(1, 'y');
                        totalPayForPlan = creditNeed + backMoney;
                        transaction = void 0;
                        _context9.prev = 47;
                        _context9.next = 50;
                        return _models.sequelize.transaction();

                    case 50:
                        transaction = _context9.sent;
                        _context9.next = 53;
                        return models.PublisherWebsite.create({
                            boughtDate: boughtDate, expireDate: expireDate, totalPriceOfPlan: totalPriceOfPlan, totalPayForPlan: totalPayForPlan, planOrder: planOrder,
                            metadata: currentPublisherWebsite ? currentPublisherWebsite.metadata : metadata,
                            type: websiteType,
                            endUserId: publisher.id + '_' + endUserId,
                            endWebsiteId: publisher.id + '_' + websiteId,
                            websites: [resourcePlan].concat(_toConsumableArray(permissionPlans))
                        }, {
                            include: [models.Website],
                            transaction: transaction
                        });

                    case 53:
                        publisherWebsite = _context9.sent;
                        description = {
                            resourceNames: resourcePlan.name + "_" + permissionPlans.map(function (permissionPlan) {
                                return permissionPlan.name;
                            }).join('_')
                        };
                        _context9.next = 57;
                        return models.CreditTransaction.create({
                            amount: creditNeed,
                            useType: 'website',
                            description: description
                        }, { transaction: transaction });

                    case 57:
                        creditTransaction = _context9.sent;


                        publisher.creditTransactions.push(creditTransaction);

                        if (!currentPublisherWebsite) {
                            _context9.next = 66;
                            break;
                        }

                        currentPublisherWebsite.extended = true;

                        if (!(currentPublisherWebsite.expireTime > moment.utc())) {
                            _context9.next = 66;
                            break;
                        }

                        currentPublisherWebsite.upgradedToUpperPlan = true;
                        currentPublisherWebsite.expireTime = moment.utc();
                        _context9.next = 66;
                        return currentPublisherWebsite.save({ fields: ['upgradedToUpperPlan', 'expireTime'], transaction: transaction });

                    case 66:

                        publisher.publisherWebsites.push(publisherWebsite);
                        _context9.next = 69;
                        return publisher.save({ fields: ['publisherWebsites', 'credit', 'creditTransaction'], transaction: transaction });

                    case 69:
                        _context9.next = 71;
                        return transaction.commit();

                    case 71:

                        res.json(new Response(true, {
                            newCredit: publisher.credit,
                            addedPublisherWebsite: publisherWebsite
                        }).json());
                        _context9.next = 80;
                        break;

                    case 74:
                        _context9.prev = 74;
                        _context9.t2 = _context9['catch'](47);

                        if (!transaction) {
                            _context9.next = 79;
                            break;
                        }

                        _context9.next = 79;
                        return transaction.rollback();

                    case 79:

                        res.status(500).json(new Response(false, {}, _context9.t2.message).json());

                    case 80:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, undefined, [[9, 15], [27, 33], [47, 74]]);
    }));

    return function (_x16, _x17) {
        return _ref9.apply(this, arguments);
    };
}());

router.post('/balanceRequest', function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(req, res) {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                    case 'end':
                        return _context10.stop();
                }
            }
        }, _callee10, undefined);
    }));

    return function (_x18, _x19) {
        return _ref10.apply(this, arguments);
    };
}()
// request balance
// TODO comming soon
// TODO It's for when we use weblancer payment for end users of publishers
);

router.get('/transactions/:type', function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(req, res) {
        var type, transactions;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
                switch (_context11.prev = _context11.next) {
                    case 0:
                        // return publisher transactions
                        type = req.params.type || 'payment';
                        transactions = void 0;
                        _context11.prev = 2;

                        if (!(type === 'payment')) {
                            _context11.next = 9;
                            break;
                        }

                        _context11.next = 6;
                        return models.PaymentTransaction.find({
                            where: {
                                publisherId: req.user.id
                            }
                        });

                    case 6:
                        transactions = _context11.sent;
                        _context11.next = 12;
                        break;

                    case 9:
                        _context11.next = 11;
                        return models.CreditTransaction.find({
                            where: {
                                publisherId: req.user.id
                            }
                        });

                    case 11:
                        transactions = _context11.sent;

                    case 12:
                        _context11.next = 18;
                        break;

                    case 14:
                        _context11.prev = 14;
                        _context11.t0 = _context11['catch'](2);

                        res.status(404).json(new Response(false, {}, "Publisher not found").json());
                        return _context11.abrupt('return');

                    case 18:

                        res.json(new Response(true, {
                            transactions: transactions
                        }).json());

                    case 19:
                    case 'end':
                        return _context11.stop();
                }
            }
        }, _callee11, undefined, [[2, 14]]);
    }));

    return function (_x20, _x21) {
        return _ref11.apply(this, arguments);
    };
}());

router.post('/login', function () {
    var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(req, res) {
        var publisher, accessToken;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) {
                switch (_context12.prev = _context12.next) {
                    case 0:
                        // login publisher
                        // check userName and password sent by user and authenticate him
                        publisher = void 0;
                        _context12.prev = 1;
                        _context12.next = 4;
                        return models.Publisher.find({
                            where: {
                                username: req.body.username,
                                password: req.body.password
                            },
                            attributes: ['id']
                        });

                    case 4:
                        publisher = _context12.sent;
                        _context12.next = 11;
                        break;

                    case 7:
                        _context12.prev = 7;
                        _context12.t0 = _context12['catch'](1);

                        res.status(401).json(new Response(false, {}, "Username or password is wrong").json());
                        return _context12.abrupt('return');

                    case 11:
                        accessToken = jwt.sign(publisher, process.env.JWT_ACCESS_TOKEN_SECRET);

                        res.json(new Response(true, { accessToken: accessToken }).json());

                    case 13:
                    case 'end':
                        return _context12.stop();
                }
            }
        }, _callee12, undefined, [[1, 7]]);
    }));

    return function (_x22, _x23) {
        return _ref12.apply(this, arguments);
    };
}());

router.post('/register', function () {
    var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(req, res) {
        var username, password, subDomain, isUnique;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
            while (1) {
                switch (_context13.prev = _context13.next) {
                    case 0:
                        // register publisher
                        username = req.body.username;
                        password = req.body.password;
                        subDomain = req.body.subDomain;
                        _context13.next = 5;
                        return _weblancerUtils2.default.isSubDomainUnique(subDomain);

                    case 5:
                        isUnique = _context13.sent;

                        if (!isUnique) {
                            res.status(409).json(new Response(false, {}, "Subdomain is in use").json());
                        }

                        _context13.next = 9;
                        return _weblancerUtils2.default.isUserNameUnique(username);

                    case 9:
                        isUnique = _context13.sent;

                        if (!isUnique) {
                            res.status(409).json(new Response(false, {}, "Username is in use").json());
                        }

                        _context13.prev = 11;
                        _context13.next = 14;
                        return models.Publisher.create({
                            username: username,
                            password: password,
                            subDomain: subDomain
                        });

                    case 14:

                        res.status(201).json(new Response(true, {}).json());
                        _context13.next = 21;
                        break;

                    case 17:
                        _context13.prev = 17;
                        _context13.t0 = _context13['catch'](11);

                        res.status(500).json(new Response(false, {}, "Username or subdomain is in use").json());
                        return _context13.abrupt('return');

                    case 21:
                    case 'end':
                        return _context13.stop();
                }
            }
        }, _callee13, undefined, [[11, 17]]);
    }));

    return function (_x24, _x25) {
        return _ref13.apply(this, arguments);
    };
}());

router.post('/subdomainavailable', function () {
    var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(req, res) {
        var subDomain, isAvailable;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
            while (1) {
                switch (_context14.prev = _context14.next) {
                    case 0:
                        // register publisher
                        subDomain = req.body.subDomain;
                        _context14.next = 3;
                        return _weblancerUtils2.default.isSubDomainUnique(subDomain);

                    case 3:
                        isAvailable = _context14.sent;

                        res.json(new Response(true, { isAvailable: isAvailable, subDomain: subDomain }).json());

                    case 5:
                    case 'end':
                        return _context14.stop();
                }
            }
        }, _callee14, undefined);
    }));

    return function (_x26, _x27) {
        return _ref14.apply(this, arguments);
    };
}());

router.post('/usernameavailable', function () {
    var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(req, res) {
        var username, isAvailable;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
            while (1) {
                switch (_context15.prev = _context15.next) {
                    case 0:
                        // register publisher
                        username = req.body.username;
                        _context15.next = 3;
                        return _weblancerUtils2.default.isUserNameUnique(username);

                    case 3:
                        isAvailable = _context15.sent;

                        res.json(new Response(true, { isAvailable: isAvailable, username: username }).json());

                    case 5:
                    case 'end':
                        return _context15.stop();
                }
            }
        }, _callee15, undefined);
    }));

    return function (_x28, _x29) {
        return _ref15.apply(this, arguments);
    };
}());

router.put('/start', function () {
    var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(req, res) {
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
            while (1) {
                switch (_context16.prev = _context16.next) {
                    case 0:
                    case 'end':
                        return _context16.stop();
                }
            }
        }, _callee16, undefined);
    }));

    return function (_x30, _x31) {
        return _ref16.apply(this, arguments);
    };
}()
// start publisher server
);

router.put('/stop', function () {
    var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(req, res) {
        return regeneratorRuntime.wrap(function _callee17$(_context17) {
            while (1) {
                switch (_context17.prev = _context17.next) {
                    case 0:
                    case 'end':
                        return _context17.stop();
                }
            }
        }, _callee17, undefined);
    }));

    return function (_x32, _x33) {
        return _ref17.apply(this, arguments);
    };
}()
// stop publisher server
);

module.exports = router;
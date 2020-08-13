'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _models = require('../models/models.js');

var _models2 = _interopRequireDefault(_models);

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Op = _sequelize2.default.Op;

var WeblancerUtils = {};

WeblancerUtils.getBackMoney = function (oldPlan) {
    if (!oldPlan) return 0;

    var totalDays = _moment2.default.utc(oldPlan.boughtDate).diff(_moment2.default.utc(oldPlan.expireTime), 'days');
    var remainDays = _moment2.default.utc().diff(_moment2.default.utc(oldPlan.expireTime), 'days');

    if (remainDays < 0) remainDays = 0;

    var usingDays = totalDays - remainDays;

    var usingMoney = usingDays / totalDays * oldPlan.totalPriceOfPlan;
    var backMoney = oldPlan.totalPayForPlan - usingMoney;

    return Math.max(0, backMoney);
};

WeblancerUtils.resolveWebsitePlans = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resourcePlanId, permissionPlansId) {
        var resourcePlan, permissionPlans;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        resourcePlan = void 0;
                        _context.prev = 1;
                        _context.next = 4;
                        return _models2.default.Website.find({
                            where: {
                                id: resourcePlanId
                            }
                        });

                    case 4:
                        resourcePlan = _context.sent;
                        _context.next = 10;
                        break;

                    case 7:
                        _context.prev = 7;
                        _context.t0 = _context['catch'](1);
                        return _context.abrupt('return');

                    case 10:
                        if (!(!permissionPlans || permissionPlans.lenght === 0)) {
                            _context.next = 12;
                            break;
                        }

                        return _context.abrupt('return');

                    case 12:
                        permissionPlans = void 0;
                        _context.prev = 13;
                        _context.next = 16;
                        return _models2.default.Website.findAll({
                            where: {
                                id: permissionPlansId
                            }
                        });

                    case 16:
                        resourcePlan = _context.sent;
                        _context.next = 22;
                        break;

                    case 19:
                        _context.prev = 19;
                        _context.t1 = _context['catch'](13);
                        return _context.abrupt('return');

                    case 22:

                        permissionPlans.forEach(function (permissionPlan) {
                            Object.keys(permissionPlan.resourceMax).forEach(function (permission) {
                                resourcePlan[permission] = permissionPlan[permission];
                            });
                        });

                        return _context.abrupt('return', { resourcePlan: resourcePlan, permissionPlans: permissionPlans });

                    case 24:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[1, 7], [13, 19]]);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

WeblancerUtils.isSubDomainUnique = function (subDomain) {
    return _models2.default.Publisher.count({ where: { subDomain: subDomain } }).then(function (count) {
        if (count != 0) {
            return false;
        }
        return true;
    });
};

WeblancerUtils.isUserNameUnique = function (username) {
    return _models2.default.Publisher.count({ where: { username: username } }).then(function (count) {
        if (count != 0) {
            return false;
        }
        return true;
    });
};

WeblancerUtils.getPaymentTransactionExist = function (resnum) {
    return _models2.default.PaymentTransaction.findOne({ where: { resnum: resnum } }).then(function (paymentTransaction) {
        if (!paymentTransaction) {
            return paymentTransaction;
        }
        return;
    });
};

WeblancerUtils.getTotalPriceOfPlan = function (websitePlan, planTime, hasOwnHostServer) {
    if (!hasOwnHostServer) {
        return planTime === 'monthly' ? websitePlan.priceMonthly : websitePlan.priceMonthly * 12;
    } else {
        return planTime === 'monthly' ? websitePlan.basePriceMonthly : websitePlan.basePriceMonthly * 12;
    }
};

WeblancerUtils.getCreditNeed = function (websitePlan, planTime, hasOwnHostServer) {
    if (!hasOwnHostServer) {
        return planTime === 'monthly' ? websitePlan.offPriceMonthly || websitePlan.priceMonthly : websitePlan.offpriceYearly || websitePlan.priceYearly;
    } else {
        return planTime === 'monthly' ? websitePlan.baseOffPriceMonthly || websitePlan.baseOffPriceMonthly : websitePlan.baseOffPriceYearly || websitePlan.baseOffPriceYearly;
    }
};

WeblancerUtils.getLowUsageServer = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(type, ownerType, publisherId) {
        var whereNotIds = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
        var where;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        where = {
                            id: _defineProperty({}, Op.notIn, whereNotIds),
                            type: type,
                            ownerType: ownerType
                        };


                        if (ownerType === 'publisher') where.publisherId = publisherId;

                        return _context2.abrupt('return', _models2.default.Server.find({
                            where: where
                        }).then(function (server) {
                            return server;
                        }).catch(function (error) {
                            return;
                        }));

                    case 3:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function (_x4, _x5, _x6) {
        return _ref2.apply(this, arguments);
    };
}();

exports.default = WeblancerUtils;
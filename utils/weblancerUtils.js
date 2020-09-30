let { models } = require('../model-manager/models.js');
let Sequelize = require('sequelize');
let moment = require('moment');
const { forEach } = require('lodash');

const Op = Sequelize.Op;

let WeblancerUtils = {};

WeblancerUtils.getBackMoney = (oldPlanSell) => {
    if (!oldPlanSell)
        return 0;
        
    let totalDays =  moment.utc(oldPlanSell.boughtDate).diff(moment.utc(oldPlanSell.expireDate), 'days');
    let remainDays = moment.utc().diff(moment.utc(oldPlanSell.expireDate), 'days');

    if (remainDays < 0) remainDays = 0;
    
    let usingDays = totalDays - remainDays;

    let usingMoney = (usingDays / totalDays) * oldPlanSell.websitePlanObject.totalPriceOfPlan;
    let backMoney = oldPlanSell.websitePlanObject.totalPayForPlan - usingMoney;

    return Math.max(0, backMoney);
}

WeblancerUtils.resolveWebsitePlans = async (resourcePlanId, permissionPlansId) => {
    let resourcePlan;
    try {
        resourcePlan = await models.Website.findOne({
            where: {
                id: resourcePlanId
            }
        });
    } catch (e) {
        return;
    }

    if (!permissionPlans || permissionPlans.lenght === 0)
        return;

    let permissionPlans;
    try {
        resourcePlan = await models.Website.findAll({
            where: {
                id: permissionPlansId
            }
        });
    } catch (e) {
        return;
    }
        
    permissionPlans.forEach(permissionPlan => {
        Object.keys(permissionPlan.resourceMax).forEach(permission => {
            resourcePlan[permission] = permissionPlan[permission];
        });
    });

    return {resourcePlan, permissionPlans};
}

WeblancerUtils.isUserNameUnique = (username) => {
    return models.Publisher.count({ where: { username: username } })
      .then(count => {
        if (count != 0) {
          return false;
        }
        return true;
    });
}

WeblancerUtils.getPaymentTransactionExist = (resnum) => {
    return models.PaymentTransaction.findOne({ where: { resnum: resnum } })
      .then(paymentTransaction => {
        paymentTransaction = paymentTransaction;
        if (!paymentTransaction) {
          return paymentTransaction;
        }
        return;
    });
}

WeblancerUtils.getTotalPriceOfPlan = (websitePlan, planTime, hasOwnHostServer) => {
    if (!hasOwnHostServer) {
        return (planTime === 'monthly' ? 
            websitePlan.priceMonthly :
            websitePlan.priceMonthly * 12);
    } else {
        return (planTime === 'monthly' ? 
            websitePlan.basePriceMonthly :
            websitePlan.basePriceMonthly * 12);
    }
}

WeblancerUtils.getTotalPriceOfPlanFromProducts = (productsDetail, planTime) => {
    if (planTime === 'trial')
        return 0;

    let sum = 0;
    (productsDetail || []).forEach(product => {
        sum += (planTime === 'monthly' ?
            product.priceMonthly :
            product.priceYearly);
    });

    return sum;
}

WeblancerUtils.getPriceOfProduct = (product, planTime) => {
    return (planTime === 'monthly' || planTime === 'trial' ?
        product.priceMonthly :
        product.priceYearly);
}

WeblancerUtils.getCreditNeed = (websitePlan, planTime, hasOwnHostServer) => {
    if (!hasOwnHostServer) {
        return (planTime === 'monthly' ? 
            websitePlan.offPriceMonthly || websitePlan.priceMonthly :
            websitePlan.offpriceYearly || websitePlan.priceYearly);
    } else {
        return (planTime === 'monthly' ? 
            websitePlan.baseOffPriceMonthly || websitePlan.baseOffPriceMonthly :
            websitePlan.baseOffPriceYearly || websitePlan.baseOffPriceYearly);
    }
}

WeblancerUtils.getLowUsageServer = async (type, ownerType, publisherId, whereNotIds = []) => {
    let where = {
        id: {[Op.notIn]: whereNotIds},
        type: type,
        ownerType: ownerType
    };

    if (ownerType === 'publisher')
        where.publisherId = publisherId;

    return models.Server.findOne({
        where: where
    }).then(server => {
        return server;
    }).catch(error => {
        return;
    });
}

WeblancerUtils.createPlanSellAndSells = async (plan, websitePlan, publisherWebsite, publisherId, isTrial, transaction) => 
{
    let allProductsId = plan.productsDetail.map(productData => {
        return productData.id;
    });

    let dbProducts = await models.Product.findAll({
        where: {
            id: allProductsId
        }
    });

    for (let i = 0; i < plan.productsDetail.lenght; i++) {
        let productData = plan.productsDetail[i];

        let dbProduct = dbProducts.find(p => {
            return p.id === productData.id;
        });

        if (!dbProduct)
            continue;

        let productSell = await models.ProductSell.create({
            isTrial: isTrial,
            sellPrice: WeblancerUtils.getPriceOfProduct(dbProduct, websitePlan.planTime),
            boughtDate: moment(websitePlan.boughtDate).toDate(),
            startDate: moment(websitePlan.startDate).toDate(),
            planTime: websitePlan.planTime,
            planId: plan.id,
            dayString: moment(websitePlan.boughtDate).format('YYYY-MM-DD'),
            metadata: {},
            productId: dbProduct.id,
            publisherId: publisherId,
            publisherWebsiteId: publisherWebsite.id
        }, {transaction});
    }

    let planSell = await models.PlanSell.create({
        planObject: plan,
        websitePlanObject: websitePlan,
        isTrial: isTrial,
        planId: plan.id,
        boughtDate: moment(websitePlan.boughtDate).toDate(),
        startDate: moment(websitePlan.startDate).toDate(),
        expireDate: moment(websitePlan.expireDate).toDate(),
        dayString: moment(websitePlan.boughtDate).format('YYYY-MM-DD'),
        publisherId: publisherId,
        publisherWebsiteId: publisherWebsite.id
    }, {transaction});
}

module.exports = WeblancerUtils;
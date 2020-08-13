import models from '../models/models.js';
import Sequelize from 'sequelize';

const Op = Sequelize.Op;
let moment = require('moment');

let WeblancerUtils = {};

WeblancerUtils.getBackMoney = (oldPlan) => {
    if (!oldPlan)
        return 0;
        
    let totalDays =  moment.utc(oldPlan.boughtDate).diff(moment.utc(oldPlan.expireTime), 'days');
    let remainDays = moment.utc().diff(moment.utc(oldPlan.expireTime), 'days');

    if (remainDays < 0) remainDays = 0;
    
    let usingDays = totalDays - remainDays;

    let usingMoney = (usingDays / totalDays) * oldPlan.totalPriceOfPlan;
    let backMoney = oldPlan.totalPayForPlan - usingMoney;

    return Math.max(0, backMoney);
}

WeblancerUtils.resolveWebsitePlans = async (resourcePlanId, permissionPlansId) => {
    let resourcePlan;
    try {
        resourcePlan = await models.Website.find({
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

WeblancerUtils.isSubDomainUnique = (subDomain) => {
    return models.Publisher.count({ where: { subDomain: subDomain } })
      .then(count => {
        if (count != 0) {
          return false;
        }
        return true;
    });
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

    return models.Server.find({
        where: where
    }).then(server => {
        return server;
    }).catch(error => {
        return;
    });
}

export default WeblancerUtils;
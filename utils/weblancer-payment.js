import getConfig from '../models/config.js';
import models from '../models/models.js';
import axios from 'axios';
import Response from './response.js';

export async function paymentInit (publisherId, amount, gateway, resNum, additionalData1, initData, onSuccess, onError) {
    // TODO sep payment setup
    // TODO move all type of payments to another library
    
    let publisherPaymentSource = {};
    let paymentSourceWhere = {publisherId: publisherId};
    gateway? paymentSourceWhere.gateway = gateway : paymentSourceWhere.isDefault = true;
    try {
        publisherPaymentSource = await models.PaymentSource.find({
            where: paymentSourceWhere
        });
    } catch (e) {
    }

    let sourceData;
    if (initData.endUserId) 
    {
        if (publisherPaymentSource)
            sourceData = publisherPaymentSource.data;
    } 
    
    if (!sourceData) 
    {
        sourceData = await getConfig("WeblancerSourceData").value;
    
        if (!sourceData){
            onError(404, new Response(false, {}, "Can't get configs from db").json());
            return;
        }
    }

    let paymentTransaction;
    try {
        paymentTransaction = await models.PaymentTransaction.create({
            gateway,
            resNum,
            amount,
            initData,
            authorType: initData.endUserId ? 'endUser': 'publisher',
            authorId: initData.endUserId || publisherId,
            sourceType: publisherPaymentSource? 'publisher': 'weblancer',
            weblancerState: 'init',
        });
    } catch (e) {
        onError(500, new Response(false, {}, "Can't create paymentTransaction").json());
        return;
    }
            
    let publisher;
    try {
        publisher = await models.Publisher.find({
            where: {
                id: publisherId
            },
            include: [models.PaymentTransaction]
        });

        publisher.paymentTransactions.push(paymentTransaction);
        await publisher.save({ fields: ['paymentTransactions']});
    } catch (e) {
        onError(500, new Response(false, {}, "Can't get or update publisher").json());
        return;
    }

    axios.post(`${paymentServiceUrl}/initpayment`, {
        sourceData, amount, resNum
    })
    .then(function (token) {
        paymentTransaction.weblancerState = 'userPayment';
        paymentTransaction.redirectToken = token;
        paymentTransaction.paymentUrl = paymentUrl;
        paymentTransaction.save({ fields: ['weblancerState', 'redirectToken']})
        .then(function () {
            onSuccess(new Response(true, {token, paymentUrl, paymentTransaction}).json());
        }).catch(function (error) {
            onError(500, new Response(false, {}, "Can't save paymentTransaction").json());
        });
    })
    .catch(async function (error) {
        paymentTransaction.weblancerState = 'error';
        paymentTransaction.message = `Got error from payment service at /initpayment: ${error.message}`;
        await paymentTransaction.save({ fields: ['weblancerState', 'message']});
        onError(500, new Response(false, {}, error.message).json());
    });
}

export async function paymentVerfiy (paymentResponse, onSuccess, onError) {
    let resNum = paymentResponse.resNum;
    let refNum = paymentResponse.refNum;

    let paymentTransaction;
    try {
        paymentTransaction = await models.PaymentTransaction.find({
            where: {
                resNum: resNum
            }
        });
    } catch (e) {
        onError(404, new Response(false, {}, "Can't find paymentTransaction").json());
        return;
    }

    paymentTransaction.weblancerState = 'verifying';
    paymentTransaction.paymentResponse = paymentResponse;
    try {
        await paymentTransaction.save({ fields: ['weblancerState', 'paymentResponse']});
    } catch (e) {
        onError(500, new Response(false, {}, "Can't save paymentTransaction").json());
        return;
    }
    
    let paymentServiceUrl = await getConfig("PaymentServiceUrl").value;

    if (!paymentServiceUrl){
        onError(404, new Response(false, {}, "Can't get configs from db").json());
        return;
    }

    axios.post(`${paymentServiceUrl}/verifypayment`, {
        refNum, MID, amount: paymentTransaction.amount, gateway: paymentTransaction.gateway
    })
    .then(async function (message) {
        paymentTransaction.weblancerState = 'complete';
        paymentTransaction.message = message;
        await paymentTransaction.save({ fields: ['weblancerState', 'message']});
        onSuccess(paymentTransaction);
    })
    .catch(async function (error) {
        paymentTransaction.weblancerState = 'error';
        paymentTransaction.message = `Got error from payment service at /verfiypayment: ${error.message}`;
        await paymentTransaction.save({ fields: ['weblancerState', 'message']});
        onError(500, new Response(false, {}, error.message).json());
    });
}

export async function paymentReverse () {
    // TODO comming soon
}
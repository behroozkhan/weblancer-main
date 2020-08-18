let { makeResNum } = require('../utils/utils.js');
let { paymentInit, paymentVerfiy } = require('../utils/weblancer-payment.js');
let WeblancerUtils = require('../utils/weblancerUtils.js');
let { sequelize, models } = require('../model-manager/models.js');
let moment = require('moment');
let express = require('express');
let axios = require('axios');
let jwt = require('jsonwebtoken');
let { getConfig } = require('../model-manager/models.js');
const Response = require('../utils/response.js');
let router = express.Router();
const { Op } = require("sequelize");

router.get('/publisher', function (req, res) {
    // return all publishers
    findAndCountAll(req, res, models.Publisher);
})

router.get('/:id', async (req, res) => {
    // return publisher by id
    let id = req.params.id;
    models.Publisher.findOne({
        where: {
           id: id
        }
    }).then(function(publisher) {
        if (!publisher) {
            res.status(404).json(
                new Response(false, {}, 
                    "Publisher not found"
                ).json()
            );
            return;
        }

        publisher = publisher;

        res.json(
            new Response(true, {
                publisher
            }).json()
        );
    }).catch(error => {
        res.status(500).json(
            new Response(false, {}, error.message).json()
        );
    });
})

router.post('/', async (req, res) => {
    // add new publisher
    let username = req.body.username;
    let password = req.body.password;

    models.Publisher.create({
        username,
        password
    })
    .then(newPublisher => {
        res.json(
            new Response(true, {
                publisher: newPublisher
            }).json()
        );
    }).catch(error => {
        res.status(500).json(
            new Response(false, {}, error.message).json()
        );
    });
})

router.delete('/:id', async (req, res) => {
    // delete publisher
    // TODO comming soon
})

router.post('/paymentinit', async (req, res) => {
    // charge requeted by publisher
    // setup payment url and redirect publisher
    let publisherId = req.user.id || req.body.publisherId;
    let amount = req.body.amount;
    let gateway = req.body.gateway;
    let resNum = req.body.resNum || makeResNum(50);
    let endUserId = req.body.endUserId;
    let paymentData = req.body.paymentData;
    
    let additionalData1 = req.user.id;

    let paymentTransaction = await WeblancerUtils.getPaymentTransactionExist(resNum);
    if (paymentTransaction) {
        res.json(new Response(true, {
            paymentTransaction
        }).json());
        return
    }

    paymentInit(publisherId, amount, gateway, resNum, additionalData1, 
        {endUserId: endUserId, paymentData: paymentData},
        (successResponse) => {
            res.json(successResponse);
        }, (errorStatusCode, errorResponse) => {
            res.status(errorStatusCode).json(errorResponse);
        }
    );
})

router.post('/paymentverify', async (req, res) => {
    // verify payment and charge publisher
    let paymentResponse = req.body.paymentResponse;

    let publisher;
    try {
        publisher = await models.Publisher.findOne({
            where: {
                id: req.user.id
            }
        });
    } catch (e) {
        res.status(500).json(
            new Response(false, {}, "Can't get publisher").json()
        );
        return;
    }

    let paymentTransaction = await WeblancerUtils.getPaymentTransactionExist(resNum);
    if (paymentTransaction && paymentTransaction.weblancerState === 'complete') {
        res.json(new Response(true, {
            newCredit: publisher.credit,
            amount: paymentTransaction.amount
        }, message));
        return
    }

    paymentVerfiy(paymentResponse,
        async (paymentTransaction) => { // onSuccess
            let transaction;
            try {
                if (paymentTransaction.sourceType === 'weblancer') 
                {
                    // get transaction
                    transaction = await sequelize.transaction();

                    let creditTransaction = await models.CreditTransaction.create({
                        amount: paymentTransaction.amount,
                        useType: paymentTransaction.initData.endUserId? 'userPayment' : 'publisherPayment',
                        description: {publisherId:publisher.id, endUserId: paymentTransaction.initData.endUserId},
                        resNum: paymentTransaction.resNum
                    }, {transaction});

                    publisher.credit += paymentTransaction.amount;
                    publisher.creditTransactions.push(creditTransaction);

                    await publisher.save({ fields: ['credit', 'creditTransactions'], transaction});

                    await transaction.commit();
                }

                res.json(new Response(true, {
                    newCredit: publisher.credit,
                    amount: paymentTransaction.amount,
                    paymentTransaction
                }, paymentTransaction.message));
            } catch (error) {
                // Rollback transaction only if the transaction object is defined
                if (transaction) await transaction.rollback();
                
                res.status(500).json(
                    new Response(false, {}, error.message).json()
                );
            }
        }, (errorStatusCode, errorResponse) => {
            res.status(errorStatusCode).json(errorResponse);
        }
    );   
})

router.post('/plan/:id', async (req, res) => {
    // set new plan for publisher
    let planId = res.params.id;

    let publisher;
    try {
        publisher = await models.Publisher.findOne({
            where: {
                id: req.user.id
            },
            include: [models.PublisherPlan, models.CreditTransaction]
        });
    } catch (e) {
        res.status(404).json(
            new Response(false, {}, "Publisher not found").json()
        );
        return;
    }

    let plan;
    try {
        plan = await models.Plan.findOne({
            where: {
                id: planId
            }
        });
    } catch (e) {
        res.status(404).json(
            new Response(false, {}, "Plan not found").json()
        );
        return;
    }

    if (publisher.publisherPlan.plan.order > plan.order) {
        res.status(403).json(
            new Response(false, {}, "Can't downgrade plan").json()
        );
        return;
    }

    let backMoney = WeblancerUtils.getBackMoney(publisher.publisherPlan);

    let planTime = req.body.planTime;

    let totalPriceOfPlan = (planTime === 'monthly' ? 
                        plan.priceMonthly :
                        plan.priceMonthly * 12);

    let creditNeed = (planTime === 'monthly' ? 
                        plan.offPriceMonthly || plan.priceMonthly :
                        plan.offpriceYearly || plan.priceYearly) - backMoney;

    // TODO Apply copouns

    if (publisher.credit - creditNeed < publisher.minCredit) {
        res.status(402).json(
            new Response(false, {
                creditNeed: creditNeed - publisher.credit - publisher.minCredit
            }, "Not enough credit").json()
        );
        return;
    }

    publisher.credit -= creditNeed;

    let boughtDate = moment.utc();
    let expireDate = planTime === 'monthly' ?
                        moment.utc().add(1, 'M') :
                        moment.utc().add(1, 'y') ;
    let totalPayForPlan = creditNeed + backMoney;

    let transaction;    

    try {
        // get transaction
        transaction = await sequelize.transaction();

        let publisherPlan = await models.PublisherPlan.create({
            boughtDate, expireDate, totalPriceOfPlan, totalPayForPlan, plan
        },{
            include: [models.Plan],
            transaction
        });

        let creditTransaction = await models.CreditTransaction.create({
            amount: creditNeed,
            useType: 'plan',
            description: {planName: plan.name}
        }, {transaction});

        publisher.creditTransactions.push(creditTransaction);

        let oldPublisherPlan = publisher.publisherPlan;
        if (oldPublisherPlan && oldPublisherPlan.expireTime > moment.utc()) 
        {
            oldPublisherPlan.upgradedToUpperPlan = true;
            oldPublisherPlan.expireTime = moment.utc();
            await oldPublisherPlan.save({ fields: ['upgradedToUpperPlan', 'expireTime'], transaction});
        }

        publisher.publisherPlan = publisherPlan;
        await publisher.save({ fields: ['publisherPlan', 'credit', 'creditTransaction'], transaction});

        await transaction.commit();

        res.json(
            new Response(true, {
                newCredit: publisher.credit,
                newPublisherPlan: publisherPlan
            }).json()
        );
    } catch (error) {
        // Rollback transaction only if the transaction object is defined
        if (transaction) await transaction.rollback();
        
        res.status(500).json(
            new Response(false, {}, error.message).json()
        );
    }
})

router.post('/createwebsite', async (req, res) => {
    // create website and reduce charge from publisher
    let endUserId = req.body.endUserId;
    let websiteId = req.body.websiteId;
    let resourcePlanId = req.body.resourcePlanId;
    let permissionPlansId = req.body.permissionPlansId;
    let planTime = req.body.planTime;
    let planOrder = req.body.planOrder;
    let metadata = req.body.metadata;
    let websiteType = req.body.websiteType;

    let publisher;
    try {
        publisher = await models.Publisher.findOne({
            where: {
                id: req.user.id
            },
            include: [models.PublisherWebsite, models.CreditTransaction]
        });
    } catch (e) {
        res.status(404).json(
            new Response(false, {}, "Publisher not found").json()
        );
        return;
    }

    let {resourcePlan, permissionPlans} = WeblancerUtils.resolveWebsitePlans(resourcePlanId, permissionPlansId);

    if (!resourcePlan) {
        res.status(404).json(
            new Response(false, {}, "Website plans not found").json()
        );
        return;
    }

    let totalPriceOfPlan = 
        WeblancerUtils.getTotalPriceOfPlan(resourcePlan, planTime, publisher.hasOwnHostServer);

    let creditNeed = 
        WeblancerUtils.getCreditNeed(resourcePlan, planTime, publisher.hasOwnHostServer);
        
    permissionPlans.forEach(permissionPlan => {
        totalPriceOfPlan += 
            WeblancerUtils.getTotalPriceOfPlan(permissionPlan, planTime, publisher.hasOwnHostServer);

        creditNeed += 
            WeblancerUtils.getCreditNeed(permissionPlan, planTime, publisher.hasOwnHostServer);
    });

    let currentPublisherWebsite;
    try {
        currentPublisherWebsite = await models.PublisherWebsite.findOne({
            where: {
                endWebsiteId: `${publisher.id}_${websiteId}`
            },
        });
    } catch (e) {
    }
    if (currentPublisherWebsite) {

        let backMoney = WeblancerUtils.getBackMoney(currentPublisherWebsite);

        creditNeed -= backMoney;
    }

    if (currentPublisherWebsite.planOrder > planOrder) {
        res.status(403).json(
            new Response(false, {}, "Can't downgrade plan").json()
        );
        return;
    }

    // TODO Apply copouns

    if (publisher.credit - creditNeed < publisher.minCredit) {
        res.status(402).json(
            new Response(false, {
                creditNeed: creditNeed - publisher.credit - publisher.minCredit
            }, "Not enough credit").json()
        );
        return;
    }

    publisher.credit -= creditNeed;

    let boughtDate = moment.utc();
    let expireDate = planTime === 'monthly' ?
                        moment.utc().add(1, 'M') :
                        moment.utc().add(1, 'y') ;
    let totalPayForPlan = creditNeed + backMoney;

    let transaction;    

    try {
        // get transaction
        transaction = await sequelize.transaction();

        let publisherWebsite = await models.PublisherWebsite.create({
            boughtDate, expireDate, totalPriceOfPlan, totalPayForPlan, planOrder, 
            metadata: currentPublisherWebsite? currentPublisherWebsite.metadata: metadata,
            type: websiteType,
            endUserId: `${publisher.id}_${endUserId}`,
            endWebsiteId: `${publisher.id}_${websiteId}`,
            websites: [resourcePlan, ...permissionPlans]
        },{
            include: [models.Website],
            transaction
        });

        let description = {
            resourceNames: resourcePlan.name + "_" + permissionPlans.map(permissionPlan => {
                return permissionPlan.name;
            }).join('_')
        };

        let creditTransaction = await models.CreditTransaction.create({
            amount: creditNeed,
            useType: 'website',
            description
        }, {transaction});

        publisher.creditTransactions.push(creditTransaction);

        if (currentPublisherWebsite) 
        {
            currentPublisherWebsite.extended = true;
            if (currentPublisherWebsite.expireTime > moment.utc()) {
                currentPublisherWebsite.upgradedToUpperPlan = true;
                currentPublisherWebsite.expireTime = moment.utc();
                await currentPublisherWebsite.save({ fields: ['upgradedToUpperPlan', 'expireTime'], transaction});
            }
        }

        publisher.publisherWebsites.push(publisherWebsite);
        await publisher.save({ fields: ['publisherWebsites', 'credit', 'creditTransaction'], transaction});

        await transaction.commit();

        res.json(
            new Response(true, {
                newCredit: publisher.credit,
                addedPublisherWebsite: publisherWebsite
            }).json()
        );
    } catch (error) {
        // Rollback transaction only if the transaction object is defined
        if (transaction) await transaction.rollback();
        
        res.status(500).json(
            new Response(false, {}, error.message).json()
        );
    }
})

router.post('/balanceRequest', async (req, res) => {
    // request balance
    // TODO comming soon
    // TODO It's for when we use weblancer payment for end users of publishers
})

router.get('/transactions/:type', async (req, res) => {
    // return publisher transactions
    let type = req.params.type || 'payment';

    let transactions;
    try {
        if (type === 'payment') 
            transactions = await models.PaymentTransaction.findOne({
                where: {
                    publisherId: req.user.id
                }
            });
        else
            transactions = await models.CreditTransaction.findOne({
                where: {
                    publisherId: req.user.id
                }
            });
    } catch (e) {
        res.status(404).json(
            new Response(false, {}, "Publisher not found").json()
        );
        return;
    }
   
    res.json(
        new Response(true, {
            transactions
        }).json()
    );
})

router.post('/login', async (req, res) => {
    // login publisher
    // check userName and password sent by user and authenticate him
    let publisher;
    try {
        publisher = await models.Publisher.findOne({
            where: {
                username: req.body.username,
                password: req.body.password,
            },
            attributes: ['id', 'role']
        });

        if (!publisher) {
            res.status(401).json(
                new Response(false, {}, "Username or password is wrong").json()
            );
            return;
        }
    } catch (e) {
        console.log(e);
        res.status(401).json(
            new Response(false, {}, "Username or password is wrong").json()
        );
        return;
    }

    const accessToken = jwt.sign(publisher.toJSON(), process.env.JWT_ACCESS_TOKEN_SECRET);
    res.json(
        new Response(true, {accessToken: accessToken}).json()
    );
})

router.post('/register', async (req, res) => {
    // register publisher
    let username = req.body.username;
    let password = req.body.password;

    isUnique = await WeblancerUtils.isUserNameUnique(username);
    if (!isUnique) {
        res.status(409).json(
            new Response(false, {}, "Username is in use").json()
        );
    }
    
    try {
        await models.Publisher.create({
            username,
            password
        });

        res.status(201).json(
            new Response(true, {}).json()
        );
    } catch (e) {
        res.status(500).json(
            new Response(false, {}, "Username or subdomain is in use").json()
        );
        return;
    }
})

router.post('/usernameavailable', async (req, res) => {
    // register publisher
    let username = req.body.username;

    let isAvailable = await WeblancerUtils.isUserNameUnique(username);
    res.json(
        new Response(true, {isAvailable, username}).json()
    );
})

router.put('/start', async (req, res) => {
    // start publisher server
    let publisherId = req.user.id;

    let publisher;
    try {
        publisher = await models.Publisher.findOne({
            where: {
                id: publisherId
            }
        });

        if (!publisher) {
            res.status(404).json(
                new Response(false, {}, "Publisher not found 1").json()
            );
            return;
        }
    } catch (e) {
        res.status(404).json(
            new Response(false, {}, "Publisher not found 2").json()
        );
        return;
    }

    let server;
    try {
        server = await models.Server.findOne({
            where: {
                publisherId: publisherId,
                ownerType: 'publisher',
                type: 'publisher'
            }
        });

        if (!server) {
            server = await models.Server.findOne({
                where: {
                    ownerType: 'weblancer',
                    type: 'publisher'
                }
            });

            if (!server) {
                res.status(404).json(
                    new Response(false, {}, "Server not found").json()
                );
                return;
            }
        }
    } catch (e) {
        console.log("error", e);
        res.status(404).json(
            new Response(false, {}, "Server not found").json()
        );
        return;
    }

    let longProcess = await models.LongProcess.create({
        name: 'Starting Publisher',
        refId: publisherId.toString(),
        status: 'Calling worker server by address: `${server.url}/worker/start`',
        state: 'called',
        timeout: 15 * 60
    });

    let input = {
        publisherId: publisherId, 
        publisherDomains: publisher.customDomains, 
        sudoPassword: server.sudoPassword,
        postgresHost: (await getConfig('WhiteLabelPotgresHost')).value,
        publisherBrandName: publisher.brandName || publisher.name,
        hasPrivateDomain: publisher.customDomains.lenght > 0,
        publisherVersion: publisher.publisherVersion,
        expressPort: publisher.expressPort,
        longProcessId: longProcess.id,
        longProcessUrl: "https://whitelabel.weblancer.ir/api/long-process/update",
        longProcessToken: jwt.sign({id: 'longProcessToken'}, process.env.JWT_ACCESS_TOKEN_SECRET)
    };

    console.log("calling publisher server: ", `${server.url}/worker/start`, input);
    let config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    axios.post(`${server.url}/worker/start`, input, config).then(axiosRes => {
        if (axiosRes.data.success) {
            console.log("calling publisher server success");
            res.json(
                new Response(true, {}, "Server starting successfully").json()
            );
        } else {
            res.status(502).json(axiosRes.data);
        }
    }).catch(async error => {
        console.log("calling publisher server error: ", error);

        longProcess.message += '\n' + longProcess.status;
        longProcess.status = `calling publisher server error`;
        longProcess.state = 'failed';
        longProcess.metaData.error = error;
        longProcess.endDate = moment().toDate();

        await longProcess.save();

        res.status(502).json(
            error.response.data || 
            new Response(false, {}, 
                "Can not connect to publisher server, maybe publisher server is not running or publisher server node app is not running or configing").json()
        );
    })

    let maxTime = 15 * 60 * 1000;
    let updateLongProcessIntervall = setInterval(async () => 
    {
        await longProcess.reload();
        console.log("Checking start process", longProcess.state, longProcess.status, 
            (longProcess.metaData.progress || 0) + '%');
        maxTime -= 1000;

        if (maxTime <= 0) clearInterval(updateLongProcessIntervall);

        if (longProcess.state === 'failed'){
            clearInterval(updateLongProcessIntervall);
            return;
        }
        if (longProcess.state === 'complete') {
            publisher.expressPort = longProcess.metaData.expressPort;
            await publisher.save();
            return;
        }
    }, 1000);
})

router.put('/stop', async (req, res) => {
    // stop publisher server
})

router.put('/:id', async (req, res) => {
    // update publisher data
    let id = req.params.id;
    let publisher;
    try {
        publisher = await models.publisher.findOne({
            where: {
                id: id
            }
        });
    } catch (e) {
        res.status(404).json(
            new Response(false, {}, "Publisher not found").json()
        );
        return;
    }

    let firstName = req.body.firstName || publisher.firstName;
    let lastName = req.body.lastName || publisher.lastName;
    let nationalCode = req.body.nationalCode || publisher.nationalCode;
    let email = req.body.email || publisher.email;
    let mobile = req.body.mobile || publisher.mobile;
    let webhookUrls = req.body.webhookUrls || publisher.webhookUrls;
    let personalStyle = req.body.personalStyle || publisher.personalStyle;
    let customDomains = req.body.customDomains || publisher.customDomains;

    publisher.update({
        firstName,
        lastName,
        nationalCode,
        email,
        email,
        mobile,
        webhookUrls,
        personalStyle,
        customDomains,
    })
    .success(result => {
        res.json(
            new Response(true, publisher).json()
        );
    })
})

module.exports = router;

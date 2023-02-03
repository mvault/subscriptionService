const Subscriptions = require("../classes/Subscription");
const schemas = require("../helpers/schemas");

const Subscription = {
    create: async (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const Subscription = new Subscriptions({});
                if (!data.company || !data.location) {
                    return reject({
                        status: 400,
                        code: "invalid_request",
                        message: "Company or location are required"
                    });
                };
                if (data.start && data.end && data.start > data.end) {
                    return reject({
                        status: 400,
                        code: "invalid_request",
                        message: "Start date cannot be greater than end date"
                    });
                };
                data.start = data.start || new Date();
                // 30 days in milliseconds = 1000 * 60 * 60 * 24 * 30 = 2592000000
                if (data.item.subscription && typeof data.item.subscription.interval) {
                    data.due_date = new Date(new Date(data.start).getTime() + Number(data.item.subscription.interval) + Number(data.item.subscription.trial_period));
                    data.end = new Date(new Date(data.start).getTime() + Number(data.item.subscription.interval) + Number(data.item.subscription.trial_period));
                } else {
                    return reject({
                        status: 400,
                        code: "invalid_request",
                        message: "Subscription interval is required"
                    });
                };
                const subscriptionObj = {
                    company: data.company,
                    location: data.location,
                    item: data.item,
                    start: data.start,
                    end: data.end,
                    due_date: data.due_date,
                    recurring: data.recurring,
                    billing_account: data.billing_account,
                };
                const result = await Subscription.save(subscriptionObj).catch((e) => {
                    return reject({
                        status: 500,
                        code: "internal_server_error",
                        message: e
                    });
                });
                return resolve(result);
            } catch (error) {
                return reject({
                    status: 500,
                    code: "internal_server_error",
                    message: error
                });
            }
        });
    },

    // activate a new subscription (pending) after payment is made
    activate: async (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const Subscription = new Subscriptions({});
                const subscription = await Subscription.getOne({_id: data._id}).catch((e) => {
                    return reject({
                        status: 500,
                        code: "internal_server_error",
                        message: e
                    });
                });
                if (!subscription) {
                    return reject({
                        status: 404,
                        code: "not_found",
                        message: "Subscription not found"
                    });
                };
                if (subscription.status !== "pending") {
                    return reject({
                        status: 400,
                        code: "invalid_request",
                        message: "Only pending subscriptions can be activated"
                    });
                };
                if (data.transaction && data.transaction.status === "success") {
                    if (subscription.transaction) {
                        return reject({
                            status: 400,
                            code: "invalid_request",
                            message: "Subscription already has a transaction, try updating the subscription"
                        });
                    } else {
                        if (data.transaction.amount !== subscription.amount) {
                            return reject({
                                status: 400,
                                code: "invalid_request",
                                message: "Transaction amount does not match subscription amount"
                            });
                        }
                        subscription.transaction = data.transaction;
                        subscription.status = "active";
                        const result = await Subscription.update(subscription).catch((e) => {
                            return reject({
                                status: 500,
                                code: "internal_server_error",
                                message: e
                            });
                        });
                        return resolve(result);
                    }
                } else {
                    return reject({
                        status: 400,
                        code: "invalid_request",
                        message: "Invalid attempt to activate subscription, invalid transaction"
                    });
                }
            } catch (error) {
                return reject({
                    status: 500,
                    code: "internal_server_error",
                    message: error
                });
            }
        });
    },

    update: async (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const Subscription = new Subscriptions({});
                const subscription = await Subscription.getOne({_id: data._id}).catch((e) => {
                    return reject({
                        status: 500,
                        code: "internal_server_error",
                        message: e
                    });
                });
                if (!subscription) {
                    return reject({
                        status: 404,
                        code: "not_found",
                        message: "Subscription not found"
                    });
                };
                Object.keys(subscription).forEach(function(key) {
                    if(Object.keys(data).includes(key)) {
                        subscription[key] = data[key];
                    }
                })
                const result = schemas.billingAccount.validate(subscription)
                const valid = result.error == null;
                if (!valid) {
                    const { details } = result.error;
                    const message = details.map(i => i.message).join(',');
                    return reject({
                        message: message,
                        data: data
                    })
                }
                const updated = await Subscription.update({_id: data._id}, data).catch((e) => {
                    return reject({
                        status: 500,
                        code: "internal_server_error",
                        message: e
                    });
                });
                return resolve(updated);
            } catch (error) {
                return reject({
                    status: 500,
                    code: "internal_server_error",
                    message: error
                });
            }
        });
    },

    changeBillingAccount: async (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const Subscription = new Subscriptions({});
                const subscription = await Subscription.getOne({_id: data._id}).catch((e) => {
                    return reject({
                        status: 500,
                        code: "internal_server_error",
                        message: e
                    });
                });
                if (!subscription) {
                    return reject({
                        status: 404,
                        code: "not_found",
                        message: "Subscription not found"
                    });
                };
                if (!data.billing_account) {
                    return reject({
                        status: 400,
                        code: "invalid_request",
                        message: "Billing account is required"
                    });
                }
                const actualBillingAccount = await pay_db.query(`FOR billing_account IN billing_accounts FILTER billing_account._id == "${subscription.billing_account}" RETURN billing_account`).catch((e) => {
                    return reject({
                        status: 500,
                        code: "internal_server_error",
                        message: e
                    });
                });
                if (actualBillingAccount.lenght && actualBillingAccount[0].due_amount) {
                    const newBillingAccount = await pay_db.query(`FOR billing_account IN billing_accounts FILTER billing_account._id == "${subscription.billing_account}" RETURN billing_account`).catch((e) => {
                        return reject({
                            status: 500,
                            code: "internal_server_error",
                            message: e
                        });
                    });
                    if (!newBillingAccount.lenght) {
                        return reject({
                            status: 400,
                            code: "invalid_request",
                            message: "Billing account is not valid"
                        });
                    } else {
                        await pay_db.query(`FOR billing_account IN billing_accounts FILTER billing_account._id == "${data.billing_account}" UPDATE billing_account WITH {due_amount: ${Number(newBillingAccount[0].due_amount) + Number(subscription.due_amount)}} IN billing_accounts RETURN NEW`).then(async (result) => {
                            if (result.lenght) {
                                await pay_db.query(`FOR billing_account IN billing_accounts FILTER billing_account._id == "${subscription.billing_account}" UPDATE billing_account WITH {due_amount: ${Number(actualBillingAccount[0].due_amount) - Number(subscription.due_amount)}} IN billing_accounts RETURN NEW`).catch((e) => {
                                    return reject({
                                        status: 500,
                                        code: "internal_server_error",
                                        message: e
                                    });
                                });
                            } else {
                                return reject({
                                    status: 400,
                                    code: "invalid_request",
                                    message: "Billing account is not valid"
                                });
                            }
                        }).catch((e) => {
                            return reject({
                                status: 500,
                                code: "internal_server_error",
                                message: e
                            });
                        });
                    }
                } else {
                    return reject({
                        status: 400,
                        code: "invalid_request",
                        message: "Billing account is not valid"
                    });
                }
                const updated = await Subscription.update({_id: data._id}, {billing_account: data.billing_account}).catch((e) => {
                    return reject({
                        status: 500,
                        code: "internal_server_error",
                        message: e
                    });
                });
                return resolve(updated);
            } catch (error) {
                return reject({
                    status: 500,
                    code: "internal_server_error",
                    message: error
                });
            }
        });
    },

    renew: async (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const Subscription = new Subscriptions({});
                const subscription = await Subscription.getOne({_id: data._id}).catch((e) => {
                    return reject({
                        status: 500,
                        code: "internal_server_error",
                        message: e
                    });
                });
                if (!subscription) {
                    return reject({
                        status: 404,
                        code: "not_found",
                        message: "Subscription not found"
                    });
                };
                if (subscription.status != "on_hold") {
                    return reject({
                        status: 400,
                        code: "invalid_request",
                        message: "Subscription can not be renewed right now, we will notify you when it is necessary"
                    });
                }
                if (data.transaction.id && data.transaction.status == "success" && data.transaction.amount) {
                    if (subscription.due_amount > data.transaction.amount) {
                        const updated = await Subscription.update({_id: data._id}, {due_amount: Number(subscription.due_amount) - Number(data.transaction.amount), status: "on_hold"}).catch((e) => {
                            return reject({
                                status: 500,
                                code: "internal_server_error",
                                message: e
                            });
                        });
                        return resolve({message: "Your subscription is not renewed yet, you still have to pay " + (Number(subscription.due_amount) - Number(data.transaction.amount)) + " " + (subscription.currency ||"USD")});
                    } else {
                        const updated = await Subscription.update({_id: data._id}, {due_amount: Number(subscription.due_amount) - Number(data.transaction.amount), status: "active", end: new Date(new Date(data.start).getTime() + Number(data.item.subscription.interval) + Number(data.item.subscription.trial_period)), due_date: new Date(new Date(data.start).getTime() + Number(data.item.subscription.interval) + Number(data.item.subscription.trial_period))}).catch((e) => {
                            return reject({
                                status: 500,
                                code: "internal_server_error",
                                message: e
                            });
                        });
                        return resolve(updated);
                    }
                } else {
                    return reject({
                        status: 400,
                        code: "invalid_request",
                        message: "The transaction is not valid"
                    });
                }
            } catch (error) {
                return reject({
                    status: 500,
                    code: "internal_server_error",
                    message: error
                });
            }
        });
    },

    cancel: async (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const Subscription = new Subscriptions({});
                const subscription = await Subscription.getOne({_id: data._id}).catch((e) => {
                    return reject({
                        status: 500,
                        code: "internal_server_error",
                        message: e
                    });
                });
                if (!subscription) {
                    return reject({
                        status: 404,
                        code: "not_found",
                        message: "Subscription not found"
                    });
                };
                if ([ "pending_cancelation", "canceled", "expired", "disabled"].includes(subscription.status)) {
                    return reject({
                        status: 400,
                        code: "invalid_request",
                        message: `Subscription is already ${subscription.status === "pending_cancelation" ? "canceled" : subscription.status}`
                    });
                } else if (subscription.status === "on_hold") {
                    let updated;
                    if (subscription.due_amount) {
                        updated = await Subscription.update({_id: data._id}, {status: "pending_cancelation", due_amount: 0}).catch((e) => {
                            return reject({
                                status: 500,
                                code: "internal_server_error",
                                message: e
                            });
                        });
                        return resolve(updated);
                    } else {
                        updated = await Subscription.update({_id: data._id}, {status: "canceled"}).catch((e) => {
                            return reject({
                                status: 500,
                                code: "internal_server_error",
                                message: e
                            });
                        });
                    }
                    return resolve(updated);
                } else if (subscription.status == "active") {
                    // check if end date is today
                    if (subscription.end && new Date(subscription.end).setHours(0,0,0,0) === new Date().setHours(0,0,0,0)) {
                        const updated = await Subscription.update({_id: data._id}, {status: "canceled"}).catch((e) => {
                            return reject({
                                status: 500,
                                code: "internal_server_error",
                                message: e
                            });
                        });
                        return resolve(updated);
                    } else {
                        // will be canceled on next billing cycle
                        const updated = await Subscription.update({_id: data._id}, {status: "pending_cancelation"}).catch((e) => {
                            return reject({
                                status: 500,
                                code: "internal_server_error",
                                message: e
                            });
                        });
                        return resolve(updated);
                    }
                } else if (subscription.status == "pending") {
                    if (subscription.due_amount) {
                        const updated = await Subscription.update({_id: data._id}, {status: "pending_cancelation", due_amount: 0}).catch((e) => {
                            return reject({
                                status: 500,
                                code: "internal_server_error",
                                message: e
                            });
                        });
                        return resolve(updated);
                    } else {
                        const updated = await Subscription.update({_id: data._id}, {status: "canceled"}).catch((e) => {
                            return reject({
                                status: 500,
                                code: "internal_server_error",
                                message: e
                            });
                        });
                        return resolve(updated);
                    }
                }
            } catch (error) {
                return reject({
                    status: 500,
                    code: "internal_server_error",
                    message: error
                });
            }
        });
    },

    upadateStatus: async (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const Subscription = new Subscriptions({});
                const subscription = await Subscription.getOne({_id: data._id}).catch((e) => {
                    return reject({
                        status: 500,
                        code: "internal_server_error",
                        message: e
                    });
                });
                if (!subscription) {
                    return reject({
                        status: 404,
                        code: "not_found",
                        message: "Subscription not found"
                    });
                };
                if (subscription.status == data.status) {
                    return reject({
                        status: 400,
                        code: "invalid_request",
                        message: "Subscription is already " + data.status
                    });
                } else {
                    if (subscription.status == "pending_cancelation" && data.status == "canceled") {
                        const updated = await Subscription.update({_id: data._id}, {status: data.status}).catch((e) => {
                            return reject({
                                status: 500,
                                code: "internal_server_error",
                                message: e
                            });
                        });
                        return resolve(updated);
                    } else if (subscription.status == "pending" && data.status == "active") {
                        const updated = await Subscription.update({_id: data._id}, {status: data.status}).catch((e) => {
                            return reject({
                                status: 500,
                                code: "internal_server_error",
                                message: e
                            });
                        });
                        return resolve(updated);
                    } else if (subscription.status == "on_hold" && data.status == "active") {
                        const updated = await Subscription.update({_id: data._id}, {status: data.status}).catch((e) => {
                            return reject({
                                status: 500,
                                code: "internal_server_error",
                                message: e
                            });
                        });
                        return resolve(updated);
                    } else if (subscription.status == "active" && data.status == "on_hold") {
                        const updated = await Subscription.update({_id: data._id}, {status: data.status}).catch((e) => {
                            return reject({
                                status: 500,
                                code: "internal_server_error",
                                message: e
                            });
                        });
                        return resolve(updated);
                    } else {
                        return reject({
                            status: 400,
                            code: "invalid_request",
                            message: "Cannot update subscription status"
                        });
                    }
                }
            } catch (error) {
                return reject({
                    status: 500,
                    code: "internal_server_error",
                    message: error
                });
            }
        });
    },

    upgradePlan: async (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const Subscription = new Subscriptions({});
                const subscription = await Subscription.getOne({_id: data._id}).catch((e) => {
                    return reject({
                        status: 500,
                        code: "internal_server_error",
                        message: e
                    });
                });
                if (!subscription) {
                    return reject({
                        status: 404,
                        code: "not_found",
                        message: "Subscription not found"
                    });
                };
                if (subscription.item.id != data.item.id) {
                    return reject({
                        status: 400,
                        code: "invalid_request",
                        message: "You are allowed to change plan for the same item only."
                    });
                }
                if (subscription.item.subscription.interval > data.item.subscription.interval) {
                    return reject({
                        status: 400,
                        code: "invalid_request",
                        message: "Downgrading a subscription is not allowed."
                    });
                }
                if (["pending_cancelation", "canceled", "expired", "disabled"].includes(subscription.status)) {
                    return reject({
                        status: 400,
                        code: "invalid_request",
                        message: "Cannot change switch plan for this subscription, subscription is " + subscription.status === "pending_cancelation" ? "canceled" : subscription.status
                    });
                } else if (subscription.status == "pending") {
                    const updated = await Subscription.update({_id: data._id}, {item: data.item}).catch((e) => {
                        return reject({
                            status: 500,
                            code: "internal_server_error",
                            message: e
                        });
                    });
                    return resolve(updated);
                } else if (subscription.status == "on_hold") {
                    const updated = await Subscription.update({_id: data._id}, {item: data.item}).catch((e) => {
                        return reject({
                            status: 500,
                            code: "internal_server_error",
                            message: e
                        });
                    });
                    return resolve(updated);
                } else if (subscription.status == "active") {
                    const updated = await Subscription.update({_id: data._id}, {item: data.item}).catch((e) => {
                        return reject({
                            status: 500,
                            code: "internal_server_error",
                            message: e
                        });
                    });
                    return resolve(updated);
                } else {
                    const updated = await Subscription.update({_id: data._id}, {plan: data.plan}).catch((e) => {
                        return reject({
                            status: 500,
                            code: "internal_server_error",
                            message: e
                        });
                    });
                    return resolve(updated);
                }
            } catch (error) {
                return reject({
                    status: 500,
                    code: "internal_server_error",
                    message: error
                });
            }
        });
    },

    delete: async (data) => {
        const Subscription = new Subscriptions({});
        const subscription = await Subscription.getOne({_id: data._id}).catch((e) => {
            return reject({
                status: 500,
                code: "internal_server_error",
                message: e
            });
        });
        if (!subscription) {
            return reject({
                status: 404,
                code: "not_found",
                message: "Subscription not found"
            });
        };
        if (!["disabled"].includes(subscription.status)) {
            return reject({
                status: 400,
                code: "invalid_request",
                message: "Cannot delete an active subscription"
            });
        };
        const deleted = await Subscription.delete({_id: data._id}).catch((e) => {
            return reject({
                status: 500,
                code: "internal_server_error",
                message: e
            });
        });
        return resolve(deleted);
    }
}

module.exports = Subscription;
const Joi = require('joi') 

const schemas = {
    subscription: Joi.object().keys({
        // pending: Subscription has been created but not paid yet
        // active: Subscription is active and paid
        // pending_cancelation: Subscription has a pre-paid term that has not been provided yet
        // on_hold: Subscription is awaiting payment
        // canceled: Subscription has been canceled
        // expired: Subscription has expired
        company: Joi.string().regex(/(^companies\/[0-9]{6,}$)/),
        location: Joi.string().regex(/(^locations\/[0-9]{6,}$)/),
        item: Joi.string().regex(/(^items\/[0-9]{6,}$)/),
        start: Joi.date().timestamp().required(),
        end: Joi.date().timestamp(),
        due_date: Joi.date().timestamp(),
        status: Joi.string().valid('pending', 'active', 'on_hold', 'pending_cancelation', 'canceled', 'expired').default('pending'),
        recurring: Joi.boolean().default(false),
        billing_account: Joi.string().regex(/(^billing_accounts\/[0-9]{6,}$)/),
        canceled_at: Joi.date().timestamp(),
        cancelation_reason: Joi.string()
    })
}

module.exports = schemas
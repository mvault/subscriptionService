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
        item: Joi.object().keys({
            id: Joi.string().regex(/(^items\/[0-9]{6,}$)/).required(),
            name: Joi.string().trim().required(),
            price: Joi.number().precision(2).required(),
            type: Joi.string().valid('grouped', 'single', 'variant').insensitive().lowercase().trim().required(),
            description: Joi.string().trim(),
            location: Joi.string().regex(/(^locations\/[0-9]{6,}$)/).required(),
            company: Joi.string().regex(/(^companies\/[0-9]{6,}$)/).required(),
            model: Joi.string().valid('digital', 'physical', 'bookable').insensitive().lowercase().trim(),
            recurring: Joi.boolean().default(true),
            subscription: Joi.object().keys({
                name: Joi.string().trim().required(),
                price: Joi.number().precision(2).required(),
                description: Joi.string().trim(),
                features: Joi.array().items(Joi.string()),
                interval: Joi.number().integer().required().min(1000 * 60 * 60 * 24).max(1000 * 60 * 60 * 24 * 365),
                trial_period: Joi.number().integer().required().default(0),
                img: Joi.array().items(Joi.string()),
            }),
            img: Joi.array().items(Joi.string()),
            categories: Joi.array().items(Joi.object().keys({
                id: Joi.string().regex(/(^[0-9]{6,}$)/),
                name: Joi.string().trim().required(),
                img: Joi.string(),
            })).options({ allowUnknown: true }).default([]),
            modifiers: Joi.array().items(Joi.object().keys({
                id: Joi.string().regex(/(^[0-9]{6,}$)/),
                name: Joi.string().trim(),
                type: Joi.string().valid('simple', 'multiple', 'extra').insensitive().lowercase().trim(),
                limit: Joi.number(),
                items: Joi.array().items(Joi.object().keys({
                    name: Joi.string().trim().required(),
                    price: Joi.number().precision(2).required(),
                    quantity: Joi.number().default(1),
                    img: Joi.string(),
                })),
            })).options({ allowUnknown: true }).default([]),
            fulfillment_type: Joi.string().valid('delivery', 'pick-up', 'dine-in', 'drive-thru').insensitive().lowercase().trim(),
            tags: Joi.array().items(Joi.string()),
            variations: Joi.array().items(Joi.object().keys({
                title: Joi.string(),
                options: Joi.array().items(Joi.object().keys({
                  id: Joi.string(),
                  name: Joi.string().required().trim(),
                  price: Joi.number().required(),
                  img: Joi.array().items(Joi.string()).default([]),
                  duration: Joi.number().default(0), // for bookable items
                }))
            })).options({ allowUnknown: true }).default([]),
        }),
        start: Joi.date().timestamp(),
        end: Joi.date().timestamp(),
        due_date: Joi.date().timestamp(),
        due_amount: Joi.number().precision(2).default(0),
        status: Joi.string().insensitive().lowercase().valid('pending', 'active', 'on_hold', 'pending_cancelation', 'canceled', 'expired', 'disabled').default('pending'),
        transactions: Joi.object().keys({
            id: Joi.string().regex(/(^transactions\/[0-9]{6,}$)/).required(),
            amount: Joi.number().precision(2).required(),
            status: Joi.string().insensitive().lowercase().valid('pending', 'paid', 'failed', 'canceled', 'refunded').required(),
        }),
        recurring: Joi.boolean().default(false),
        customer: Joi.string().regex(/(^customers\/[0-9]{6,}$)/).required(),
        billing_account: Joi.string().regex(/(^billing_accounts\/[0-9]{6,}$)/).required(),
        canceled_at: Joi.date().timestamp(),
        cancelation_reason: Joi.string()
    })
}

module.exports = schemas
const Subscriptions = require("../classes/Subscription");
const schemas = require("../helpers/schemas");

const Subscription = {
    create: async (req, res) => {
        return new Promise(async (resolve, reject) => {
            try {
                const data = req.body;
                const subscription = new Subscriptions({});
                
                return resolve(result);
            } catch (error) {
                return reject(error);
            }
        });
    },
    update: async (req, res) => {

    },
    cancel: async (req, res) => {

    },
    upadateStatus: async (req, res) => {

    },
    delete: async (req, res) => {
        
    }
}

module.exports = Subscription;
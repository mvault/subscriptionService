import { db } from "../data/arango";

const collections = {
  Subscription: "subscription",
};

module.exports = class Request {
    constructor(data) {
        this._key = data._key;
        this._id = data._id;

    }
    
    // get data by key
    static async get(key) {
        const data = await db.collection(collections.Subscription).document(key);
        return new Request(data);
    }


  }
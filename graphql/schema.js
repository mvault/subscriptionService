import { db, order_db } from "../data/arango";
const gql = require("graphql");
const subscriptionType = require("types/subscription");

const queryType = new gql.GraphQLObjectType({
  name: "Query",
  fields() {
    return {
      subscription: {
        type: subscriptionType,
        args: {
          id: {
            type: gql.GraphQLString,
          },
        },
        async resolve(root, args) {
          let query = `FOR subscription IN subscriptions FILTER subscription._id == '${args.id}' RETURN subscription`;
          console.log(query);
          const cursor = await db.query(query);
          const data = await cursor.all();
          return data[0];
        },
      },
    };
  },
});

module.exports = new gql.GraphQLSchema({
  query: queryType,
});

const gql = require('graphql');

const subscriptionType = new gql.GraphQLObjectType({
  name: "subscription",
  fields() {
    return {
      _id: {
        type: gql.GraphQLString,
      },
      _key: {
        type: gql.GraphQLString,
      },
      company: {
        type: gql.GraphQLString,
      },
      location: {
        type: gql.GraphQLString,
      },
      item: {
        type: gql.GraphQLString,
      },
      start: {
        type: gql.GraphQLString,
      },
      end: {
        type: gql.GraphQLString,
      },
      due_date: {
        type: gql.GraphQLString,
      },
      status: {
        type: gql.GraphQLString,
      },
      recurring: {
        type: gql.GraphQLBoolean,
      },
      billing_account: {
        type: gql.GraphQLString,
      },
      is_canceled: {
        type: gql.GraphQLBoolean,
      },
      canceled_at: {
        type: gql.GraphQLString,
      },
      cancelation_reason: {
        type: gql.GraphQLString,
      },
      created_at: {
        type: gql.GraphQLString,
      },
      updated_at: {
        type: gql.GraphQLString,
      },
    };
  },
});

module.exports = subscriptionType;

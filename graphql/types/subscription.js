import { GraphQLObjectType, GraphQLString } from "graphql";

const subscriptionType = new GraphQLObjectType({
  name: "subscription",
  fields() {
    return {
      _id: {
        type: GraphQLString,
      },
      company: {
        type: GraphQLString,
      },
      location: {
        type: GraphQLString,
      },
      item: {
        type: GraphQLString,
      },
      status: {
        type: GraphQLString,
      },
      recurring: {
        type: GraphQLBoolean,
      },
      start: {
        type: GraphQLString,
      },
      end: {
        type: GraphQLString,
      },
      due_date: {
        type: GraphQLString,
      },
    };
  },
});

export default subscriptionType;

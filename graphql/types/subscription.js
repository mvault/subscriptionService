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
        type: new gql.GraphQLList(
          new gql.GraphQLObjectType({
            name: "subscription_item",
            fields() {
              return {
                id: {
                  type: gql.GraphQLString,
                },
                name: {
                  type: gql.GraphQLString,
                },
                price: {
                  type: gql.GraphQLFloat,
                },
                type: {
                  type: gql.GraphQLString,
                },
                description: {
                  type: gql.GraphQLString,
                },
                location: {
                  type: gql.GraphQLString,
                },
                company: {
                  type: gql.GraphQLString,
                },
                model: {
                  type: gql.GraphQLString,
                },
                recurring: {
                  type: gql.GraphQLBoolean,
                },
                subscription: {
                  type: new gql.GraphQLList(
                    new gql.GraphQLObjectType({
                      name: "subscription_item_subscription",
                      fields() {
                        return {
                          name: {
                            type: gql.GraphQLString,
                          },
                          price: {
                            type: gql.GraphQLFloat,
                          },
                          description: {
                            type: gql.GraphQLString,
                          },
                          features: {
                            type: new gql.GraphQLList(gql.GraphQLString),
                          },
                          interval: {
                            type: gql.GraphQLInt,
                          },
                          trial_period: {
                            type: gql.GraphQLInt,
                          },
                          img: {
                            type: new gql.GraphQLList(gql.GraphQLString),
                          },
                        };
                      },
                    })
                  ),
                },
                img: {
                  type: new gql.GraphQLList(gql.GraphQLString),
                },
                categories: {
                  type: new gql.GraphQLList(new gql.GraphQLObjectType({
                    name: "subscription_item_categories",
                    fields() {
                      return {
                        id: {
                          type: gql.GraphQLString,
                        },
                        name: {
                          type: gql.GraphQLString,
                        },
                        img: {
                          type: gql.GraphQLString,
                        },
                      };
                    },
                  })),
                },
                modifiers: {
                  type: new gql.GraphQLList(new gql.GraphQLObjectType({
                    name: "subscription_item_modifiers",
                    fields() {
                      return {
                        id: {
                          type: gql.GraphQLString,
                        },
                        name: {
                          type: gql.GraphQLString,
                        },
                        type: {
                          type: gql.GraphQLString,
                        },
                        limit: {
                          type: gql.GraphQLInt,
                        },
                        items: {
                          type: new gql.GraphQLList(new gql.GraphQLObjectType({
                            name: "subscription_item_modifiers_items",
                            fields() {
                              return {
                                name: {
                                  type: gql.GraphQLString,
                                },
                                price: {
                                  type: gql.GraphQLFloat,
                                },
                                quantity: {
                                  type: gql.GraphQLInt,
                                },
                                img: {
                                  type: gql.GraphQLString,
                                },
                              };
                            },
                          })),
                        },
                      };
                    },
                  })),
                },
                fulfillment_type: {
                  type: gql.GraphQLString,
                },
                tags: {
                  type: new gql.GraphQLList(gql.GraphQLString),
                },
                variations: {
                  type: new gql.GraphQLList(new gql.GraphQLObjectType({
                    name: "subscription_item_variations",
                    fields() {
                      return {
                        title: {
                          type: gql.GraphQLString,
                        },
                        options: {
                          type: new gql.GraphQLList(
                            new gql.GraphQLObjectType({
                              name: "subscription_item_variations_options",
                              fields() {
                                return {
                                  id: {
                                    type: gql.GraphQLString,
                                  },
                                  name: {
                                    type: gql.GraphQLString,
                                  },
                                  price: {
                                    type: gql.GraphQLFloat,
                                  },
                                  img: {
                                    type: new gql.GraphQLList(gql.GraphQLString),
                                  },
                                  duration: {
                                    type: gql.GraphQLInt,
                                  },
                                };
                              },
                            })
                          ),
                        },
                      };
                    },
                  })),
                },
              };
            },
          })
        ),
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
      due_amount: {
        type: gql.GraphQLFloat,
      },
      status: {
        type: gql.GraphQLString,
      },
      transaction: {
        type: new gql.GraphQLObjectType({
          name: "subscription_transaction",
          fields() {
            return {
              id: {
                type: gql.GraphQLString,
              },
              amount: {
                type: gql.GraphQLFloat,
              },
              status: {
                type: gql.GraphQLString,
              },
            };
          },
        }),
      },
      recurring: {
        type: gql.GraphQLBoolean,
      },
      customer: {
        type: gql.GraphQLString,
      },
      billing_account: {
        type: gql.GraphQLString,
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

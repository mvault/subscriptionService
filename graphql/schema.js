const {db} = require("../data/arango");

const gql = require("graphql");
const subscriptionType = require("./types/subscription");

const queryType = new gql.GraphQLObjectType({
  name: "Query",
  fields() {
    return {
      subscription: {
        type: subscriptionType,
        args: {
          role: {
            type: gql.GraphQLString,
          },
          id: {
            type: gql.GraphQLString,
          },
          removed: {
            type: gql.GraphQLBoolean,
            defaultValue: false,
          },
        },
        async resolve(root, args) {
          let query = `FOR subscription IN subscriptions FILTER `;
          if (["admin", "manager", "customer"].includes(args.role)) {
            query += `subscription._id == "${args.id}" `;
          } else {
            return null;
          }
          query += `RETURN subscription`;
          console.log(query);
          const cursor = await db.query(query);
          const data = await cursor.all();
          return data[0];
        },
      },
      subscriptions: {
        type: new gql.GraphQLList(subscriptionType),
        args: {
          role: {
            type: gql.GraphQLString,
          },
          company: {
            type: gql.GraphQLString,
          },
          location: {
            type: gql.GraphQLString,
          },
          price: {
            type: new gql.GraphQLInputObjectType({
              name: "subscription_price",
              fields: {
                min: {
                  type: gql.GraphQLFloat,
                },
                max: {
                  type: gql.GraphQLFloat,
                },
                equal: {
                  type: gql.GraphQLFloat,
                },
              },
            }),
          },
          item_id: {
            type: gql.GraphQLString,
          },
          interval: {
            type: gql.GraphQLInt,
          },
          fulfillment_type: {
            type: gql.GraphQLString,
          },
          tag: {
            type: gql.GraphQLString,
          },
          start: {
            type: new gql.GraphQLInputObjectType({
              name: "subscription_start",
              fields: {
                min: {
                  type: gql.GraphQLString,
                },
                max: {
                  type: gql.GraphQLString,
                },
                equal: {
                  type: gql.GraphQLString,
                },
              },
            }),
          },
          end: {
            type: new gql.GraphQLInputObjectType({
              name: "subscription_end",
              fields: {
                min: {
                  type: gql.GraphQLString,
                },
                max: {
                  type: gql.GraphQLString,
                },
                equal: {
                  type: gql.GraphQLString,
                },
              },
            }),
          },
          due_amount: {
            type: new gql.GraphQLInputObjectType({
              name: "subscription_due_amount",
              fields: {
                min: {
                  type: gql.GraphQLFloat,
                },
                max: {
                  type: gql.GraphQLFloat,
                },
                equal: {
                  type: gql.GraphQLFloat,
                },
              },
            }),
          },
          due_date: {
            type: new gql.GraphQLInputObjectType({
              name: "subscription_due_date",
              fields: {
                min: {
                  type: gql.GraphQLString,
                },
                max: {
                  type: gql.GraphQLString,
                },
                equal: {
                  type: gql.GraphQLString,
                },
              },
            }),
          },
          status: {
            type: gql.GraphQLString,
          },
          recurring: {
            type: gql.GraphQLBoolean,
          },
          customer: {
            type: gql.GraphQLString,
          },
          removed: {
            type: gql.GraphQLBoolean,
            defaultValue: false,
          },
        },
        async resolve(root, args) {
          let query = `FOR subscription IN subscriptions FILTER `;
          query += args.removed
            ? `!!subscription.removed `
            : `!subscription.removed `;
          if (args.role === "admin") {
            if (args.company) {
              query += `&& subscription.company == "${args.company}" `;
            } else {
              return null;
            }
            if (args.location) {
              query += `&& subscription.location == "${args.location}" `;
            }
          } else if (args.role === "manager") {
            if (args.location) {
              query += `&& subscription.company == "${args.company}" `;
            } else {
              return null;
            }
          } else if (args.role === "customer") {
            if (args.customer) {
              query += `&& subscription.customer == "${args.customer}" `;
            } else {
              return null;
            }
          } else {
            return null;
          }
          if (args.role !== "customer") {
            if (args.customer) {
              query += `&& subscription.customer == "${args.customer}" `;
            }
          }
          if (args.price) {
            if (args.price.min || args.price.max) {
              if (args.price.min) {
                query += `&& subscription.price >= ${args.price.min} `;
              }
              if (args.price.max) {
                query += `&& subscription.price <= ${args.price.max} `;
              }
            } else if (args.price.equal) {
              query += `&& subscription.price == ${args.price.equal} `;
            }
          }
          if (args.item_id) {
            query += `&& subscription.item.id == "${args.item_id}" `;
          }
          if (args.interval) {
            if (args.interval.min || args.interval.max) {
              if (args.interval.min) {
                query += `&& subscription.interval >= ${args.interval.min} `;
              }
              if (args.interval.max) {
                query += `&& subscription.interval <= ${args.interval.max} `;
              }
            } else if (args.interval.equal) {
              query += `&& subscription.interval == ${args.interval.equal} `;
            }
          }
          if (args.fulfillment_type) {
            query += `&& subscription.fulfillment_type == "${args.fulfillment_type}" `;
          }
          if (args.tag) {
            query += `&& "${args.tag}" IN subscription.tags`;
          }
          if (args.start) {
            if (args.start.min || args.start.max) {
              if (args.start.min) {
                query += `&& subscription.start >= "${args.start.min}" `;
              }
              if (args.start.max) {
                query += `&& subscription.start <= "${args.start.max}" `;
              }
            } else if (args.start.equal) {
              query += `&& subscription.start == "${args.start.equal}" `;
            }
          }
          if (args.end) {
            if (args.end.min || args.end.max) {
              if (args.end.min) {
                query += `&& subscription.end >= "${args.end.min}" `;
              }
              if (args.end.max) {
                query += `&& subscription.end <= "${args.end.max}" `;
              }
            } else if (args.end.equal) {
              query += `&& subscription.end == "${args.end.equal}" `;
            }
          }
          if (args.due_amount) {
            if (args.due_amount.min || args.due_amount.max) {
              if (args.due_amount.min) {
                query += `&& subscription.due_amount >= ${args.due_amount.min} `;
              }
              if (args.due_amount.max) {
                query += `&& subscription.due_amount <= ${args.due_amount.max} `;
              }
            } else if (args.due_amount.equal) {
              query += `&& subscription.due_amount == ${args.due_amount.equal} `;
            }
          }
          if (args.due_date) {
            if (args.due_date.min || args.due_date.max) {
              if (args.due_date.min) {
                query += `&& subscription.due_date >= "${args.due_date.min}" `;
              }
              if (args.due_date.max) {
                query += `&& subscription.due_date <= "${args.due_date.max}" `;
              }
            } else if (args.due_date.equal) {
              query += `&& subscription.due_date == "${args.due_date.equal}" `;
            }
          }
          if (args.status) {
            query += `&& subscription.status == "${args.status}" `;
          }
          if (Object.keys(args).includes("recurring")) {
            if (args.recurring) {
              query += `&& !!subscription.recurring `;
            } else {
              query += `&& !subscription.recurring `;
            }
          }
          query += `RETURN subscription`;
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

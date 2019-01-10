// here we can directly send the query to prisma backend if the query is same that prisma expect and doen'nt containts any filter and authentcation at all then forward the request directly to prisma API


const { forwardTo } = require('prisma-binding');

const Query = {
  // forwarding to prisma API directly
  items: forwardTo('db')

  // async items (parent, args, ctx, info) {
  //   const items = await ctx.db.query.items ();
  //   return items;
  // },
};

module.exports = Query;

// query allItems {
//   items {
//     id
//     title
//   }
// }

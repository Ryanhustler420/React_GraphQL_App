// here we can directly send the query to prisma backend if the query is same that prisma expect and doen'nt containts any filter and authentcation at all then forward the request directly to prisma API


const { forwardTo } = require('prisma-binding');

const Query = {
  // forwarding to prisma API directly
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db')

  // query {
  //   itemsConnection(where: {
  //     title_contains: "Candle"
  //   }){
  //     aggregate {
  //       count
  //     }
  //   }
  // }
};

module.exports = Query;
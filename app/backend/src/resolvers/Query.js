// Query.js only use for Read [pulling] data from Data base not for Create Update Delete
const Query = {
  // dogs: function() { // code... }
  dogs (parent, ages, ctx, info) {
    //  return [{name: 'Snickers'}, {name: 'Sunny'}];
    global.dogs = global.dogs || [];
    return global.dogs;
  },
};

module.exports = Query;

// ## run this in GraphQl playground
// query {
//      dogs {
//          name
//      }
// }
//

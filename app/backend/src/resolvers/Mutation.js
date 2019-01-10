const Mutations = {
  async createItem (parent, args, ctx, info) {
    // TODO: Check if they are logged in

    const item = await ctx.db.mutation.createItem (
      {
        data: {
          ...args,
        },
      },
      info
    );

    return item;
  },
};
// info => query
module.exports = Mutations;

// Run this query on playground

// mutation {
//   createItem(
//     title: "Second"
//     description: "Testing Second Item"
//     image: "dog1.jpg"
//     largeImage: "doggg.jpg"
//     price: 1000
//   ) {
//     id 
//     title
//   }
// }

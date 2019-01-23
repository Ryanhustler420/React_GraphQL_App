// here we can directly send the query to prisma backend if the query is same that prisma expect and doen'nt containts any filter and authentcation at all then forward the request directly to prisma API
const {hasPermission} = require ('../utils');
const {forwardTo} = require ('prisma-binding');

const Query = {
  // forwarding to prisma API directly
  items: forwardTo ('db'),
  item: forwardTo ('db'),
  itemsConnection: forwardTo ('db'),
  me (parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.userId) {
      return null;
    }

    return ctx.db.query.user (
      {
        where: {id: ctx.request.userId},
      },
      info
    );
  },
  async users (parent, args, ctx, info) {
    // 1. check if they are logged in or not ?
    if (!ctx.request.userId) {
      throw new Error (`You must be logged in!`);
    }
    // 2. check if the user has the permissions to query all the users
    hasPermission (ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

    // 3. if they do, query all the users!
    return ctx.db.query.users ({}, info);
  },
  async order (parent, args, ctx, info) {
    // 1. Make sure they are logged in
    if (!ctx.request.userId) {
      throw new Error ('You arent logged in!');
    }
    // 2. Query the current order
    const order = await ctx.db.query.order (
      {
        where: {id: args.id},
      },
      info
    );
    // 3. Check if they have the permission to see this order
    const ownsOrder = order.user.id === ctx.request.userId;
    const hasPermissionToSeeOrder = ctx.request.user.permission.includes (
      'ADMIN'
    );
    if (!ownsOrder || !hasPermissionToSeeOrder) {
      throw new Error ('You cant see this buddy');
    }
    // 4. Return the order
    return order;
  },
};

module.exports = Query;

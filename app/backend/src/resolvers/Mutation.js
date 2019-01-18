const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
const {randomBytes} = require ('crypto');
const {promisify} = require ('util');

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
  updateItem (parent, args, ctx, info) {
    // first take a copy of the updates
    const updates = {...args};
    // remove the ID from the updates
    delete updates.id;
    // run the update method
    return ctx.db.mutation.updateItem (
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info
    );
  },
  async deleteItem (parent, args, ctx, info) {
    const where = {id: args.id};
    // Find the item
    const item = await ctx.db.query.item ({where}, `{id title}`);
    // check if they own the item, or have permission
    // TODO

    // delete it
    return ctx.db.mutation.deleteItem ({where}, info);
  },
  async signup (parent, args, ctx, info) {
    // lowercase their email
    args.email = args.email.toLowerCase ();
    // hash their password
    const password = await bcrypt.hash (args.password, 10);
    // create a user in the database
    const user = await ctx.db.mutation.createUser (
      {
        data: {
          ...args,
          password,
          permission: {set: ['USER']},
        },
      },
      info
    );
    // create the JWT token for theme
    const token = jwt.sign ({userId: user.id}, process.env.APP_SECRET);
    // We set the jwt as a cookie on the response
    ctx.response.cookie ('token', token, {
      // (httpOnly:) you cannot access this token via
      // javascript, because you could get third party
      // javascript on your website or you could get a ROG code extension.
      // you do not want you JS file to access this cookies.
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });
    //  Finalllllly we return the user to the browser
    return user;
  },
  async signin (parent, {email, password}, ctx, info) {
    // 1. check if there is a user with that email
    const user = await ctx.db.query.user ({where: {email: email}});

    if (!user) {
      throw new Error (`No Such user found for email ${email}`);
    }

    // 2. check if their password is correct
    const valid = await bcrypt.compare (password, user.password);
    if (!valid) {
      throw new Error (`Invalid Password!`);
    }

    // 3. generate the JWT Token
    const token = jwt.sign ({userId: user.id}, process.env.APP_SECRET);

    // 4. Set the cookie with the token
    ctx.response.cookie ('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });

    // 5. Return the User
    return user;
  },
  signout (parent, args, ctx, info) {
    ctx.response.clearCookie ('token');
    return {message: 'Goodbye!'};
  },
  async requestReset (parent, args, ctx, info) {
    // 1. Check if this is a real user
    const user = await ctx.db.query.user ({where: {email: args.email}});
    if (!user) {
      throw new Error (`No Such user found for email ${args.email}`);
    }
    // 2. Set a reset token and expiry on that user
    const randomBytesPromiseified = promisify (randomBytes);
    const resetToken = (await randomBytesPromiseified (20)).toString ('hex');
    const resetTokenExpiry = Date.now () + 3600000; // 1 hour from now
    const res = await ctx.db.mutation.updateUser ({
      where: {email: args.email},
      data: {resetToken, resetTokenExpiry},
    });
    return {message: 'thanks'};
    // 3. Email them that reset token
  },
};
// info => query
module.exports = Mutations;

// run this is playground

// mutation requestReset {
//   requestReset(email: "gouravgupta840@gmail.com") {
//     message
//   }
// }

// check in prisma

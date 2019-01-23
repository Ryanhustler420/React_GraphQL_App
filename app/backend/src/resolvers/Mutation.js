const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
const {randomBytes} = require ('crypto');
const {promisify} = require ('util');
const {transport, makeANiceEmail} = require ('../mail');
const {hasPermission} = require ('../utils');
const stripe = require ('../stripe');

const Mutations = {
  async createItem (parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error ('You must be logged in to do that!');
    }

    const item = await ctx.db.mutation.createItem (
      {
        data: {
          // This is how to create a relationship between the Item and the User
          user: {
            connect: {
              id: ctx.request.userId,
            },
          },
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
    const item = await ctx.db.query.item ({where}, `{id title user { id }}`);
    // check if they own the item, or have permission
    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermission = ctx.request.user.permission.some (permission => [
      'ADMIN',
      'ITEMDELETE'.includes (permission),
    ]);

    if (!ownsItem && hasPermission) {
      throw new Error ("You don't have permission to do that!");
    }

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
    // 3. Email them that reset token

    const mailRes = await transport.sendMail ({
      from: 'gouravgupta920@gmail.com',
      to: user.email,
      subject: 'Your Password Reset Token',
      html: makeANiceEmail (`Your Password Reset Token is here! \n\n 
      <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here to Reset</a>`),
    });

    // 4. Return the message
    return {message: 'thanks'};
  },
  async resetPassword (parent, args, ctx, info) {
    // 1. check if the passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error ("Yo Password don't match!");
    }
    // 2. check if its a legit reset token
    // 3. check if its expired
    const [user] = await ctx.db.query.users ({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now () - 3600000,
      },
    });

    if (!user) {
      throw new Error ('This token is either invalid or expired!');
    }
    // 4. Hash their new password
    const password = await bcrypt.hash (args.password, 10);
    // 5. Save the new password to the user and remove old resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser ({
      where: {email: user.email},
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    // 6. Generate JWT
    const token = jwt.sign ({userId: updatedUser.id}, process.env.APP_SECRET);
    // 7. Set the JWT cookie
    ctx.response.cookie ('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    // 8. return the new user
    return updatedUser;
    // 9. Bamb done!
  },
  async updatePermissions (parent, args, ctx, info) {
    // 1. check if they are logged in
    if (!ctx.request.userId) {
      throw new Error ('You must be logged in!');
    }
    // 2. query the current user
    const currentUser = await ctx.db.query.user (
      {
        where: {
          id: ctx.request.userId,
        },
      },
      info
    );
    // 3. check if they have permissions to do this
    hasPermission (currentUser, ['ADMIN', 'PERMISSIONUPDATE']);
    // 4. update the Permissions
    return ctx.db.mutation.updateUser (
      {
        data: {
          permission: {
            set: args.permissions,
          },
        },
        where: {
          id: args.userId,
        },
      },
      info
    );
  },
  async addToCart (parent, args, ctx, info) {
    // 1. Make sure they are signed in
    const {userId} = ctx.request;

    if (!userId) {
      throw new Error ('You must be signed in sooon');
    }
    // 2. Query the users current cart
    const [existingCartItem] = await ctx.db.query.cartItems ({
      where: {
        user: {id: userId},
        item: {id: args.id},
      },
    });
    // 3. Check if that item is already in their cart and increement by 1 if it is
    if (existingCartItem) {
      console.log ('This item is already in their cart');
      return ctx.db.mutation.updateCartItem (
        {
          where: {id: existingCartItem.id},
          data: {quantity: existingCartItem.quantity + 1},
        },
        info
      );
    }
    // 4. if its not, create a fresh CartItem for that user!
    return ctx.db.mutation.createCartItem (
      {
        data: {
          user: {
            connect: {id: userId},
          },
          item: {
            connect: {id: args.id},
          },
        },
      },
      info
    );
  },
  async removeFromCart (parent, args, ctx, info) {
    // 1. Find the cart item
    const cartItem = await ctx.db.query.cartItem (
      {
        where: {
          id: args.id,
        },
      },
      `{ id, user { id }}`
    );
    // 1.5 Make sure we found an item
    if (!cartItem) throw new Error ('No CartItem Found!');
    // 2. Make sure they own that cart item
    if (cartItem.user.id !== ctx.request.userId) {
      throw new Error ('Cheaten huhh');
    }
    // 3. Delete That cart item
    return ctx.db.mutation.deleteCartItem (
      {
        where: {
          id: args.id,
        },
      },
      info
    );
  },
  async createOrder (parent, args, ctx, info) {
    // 1. Query the current user and make sure they are signed in
    const {userId} = ctx.request;
    if (!userId) {
      throw new Error ('You must be signed in to complete this order.');
    }
    const user = await ctx.db.query.user (
      {where: {id: userId}},
      `{
        id 
        name 
        email 
        cart { 
              id 
              quantity
              item { title price id description image }
            }
      }
    `
    );
    // 2. recalculate the total for the price
    const amount = user.cart.reduce (
      (tally, cartItem) => tally + cartItem.item.price * cartItem.quantity,
      0
    );
    // console.log (`Going to charge for a total of ${amount}`);

    // 3. Create the stripe charge ( which turn token into money$$$ )
    const charge = await stripe.charges.create ({
      amount,
      currency: 'USD',
      source: args.token,
    });
    // 4. Convert the CartItems to OrderItems
    // 5. create the Order
    // 6. Clean up - clear the user cart, delete cartItem
    // 7. Return the Order to the client
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

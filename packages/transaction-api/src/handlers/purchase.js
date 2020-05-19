const postAuthDetails = require('../service/post-auth');

const purchase = async (ctx) => {
  // const addAuth = await postAuthDetails(ctx, ctx.request.body);

  // ctx.body = {
  //   code: addAuth.code,
  //   message: addAuth.message
  // }

  ctx.body = 'Purchase'
};

module.exports = purchase;

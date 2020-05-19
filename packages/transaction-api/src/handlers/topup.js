const postUserDetails = require('../service/post-user');

const topup = async (ctx) => {
  // const addUser = await postUserDetails(ctx, ctx.request.body);

  // ctx.body = {
  //   code: addUser.code,
  //   message: addUser.message
  // }

  ctx.body = 'Topup'
};

module.exports = topup;

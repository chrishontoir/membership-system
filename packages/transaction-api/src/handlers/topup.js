const postTopupDetails = require('../service/post-topup');

const topup = async (ctx) => {
  const postTopup = await postTopupDetails(ctx, ctx.request.body);

  ctx.body = {
    code: postTopup.code,
    message: postTopup.message
  };

  if (postTopup.balance) {
    ctx.body = { ...ctx.body, balance: postTopup.balance };
  }
};

module.exports = topup;

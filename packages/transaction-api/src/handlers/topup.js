const postTopupDetails = require('../service/post-topup');

const topup = async (ctx) => {
  const postTopup = await postTopupDetails(ctx, ctx.request.body);

  ctx.body = {
    code: postTopup.code,
    message: postTopup.message
  };
};

module.exports = topup;

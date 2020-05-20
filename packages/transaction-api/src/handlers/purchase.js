const postPurchaseDetails = require('../service/post-purchase');

const purchase = async (ctx) => {
  const postPurchase = await postPurchaseDetails(ctx, ctx.request.body);

  ctx.body = {
    code: postPurchase.code,
    message: postPurchase.message
  };

  if (postPurchase.balance) {
    ctx.body = { ...ctx.body, balance: postPurchase.balance };
  }
};

module.exports = purchase;

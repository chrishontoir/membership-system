const checkAuthDetails = require('../service/check-auth');

const authenticate = async (ctx) => {
  const checkAuth = await checkAuthDetails(ctx, ctx.request.body);

  ctx.body = {
    code: checkAuth.code,
    message: checkAuth.message
  };

  if (checkAuth.token) {
    ctx.body = { ...ctx.body, token: checkAuth.token };
  }
};

module.exports = authenticate;

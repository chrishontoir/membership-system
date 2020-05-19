const postAuthDetails = require('../service/post-auth');

const register = async (ctx) => {
  const addAuth = await postAuthDetails(ctx, ctx.request.body);

  ctx.body = {
    code: addAuth.code,
    message: addAuth.message
  }
};

module.exports = register;

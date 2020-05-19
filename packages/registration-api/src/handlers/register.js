const postUserDetails = require('../service/post-user');

const register = async (ctx) => {
  const addUser = await postUserDetails(ctx, ctx.request.body);

  ctx.body = {
    code: addUser.code,
    message: addUser.message
  };
};

module.exports = register;

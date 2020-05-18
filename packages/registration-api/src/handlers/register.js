const register = (ctx) => {
  ctx.body = {
    code: 'REG002',
    message: 'Card successfully registered'
  }
};

module.exports = register;

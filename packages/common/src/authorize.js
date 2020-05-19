const authorize = async (ctx, next) => {
  if (!ctx.request.headers.authorization) {
    ctx.body = 'Unauthorized';
  }

  const token = ctx.request.headers.authorization.replace('Bearer ', '');

  const payload = token.split('.')[1];

  const decodePayload = JSON.parse(Buffer.from(payload, 'base64').toString('ascii'));

  if (decodePayload.cardId !== ctx.request.body.cardId) {
    ctx.body = 'Forbidden';
    return;
  }
  await next();
};

module.exports = authorize;

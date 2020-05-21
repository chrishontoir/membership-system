const getResponse = require('./get-response');

const authorize = async (ctx, next) => {
  if (!ctx.request.headers.authorization) {
    ctx.body = getResponse('API002');
    ctx.db.$pool.end();
    return;
  }

  const token = ctx.request.headers.authorization.replace('Bearer ', '');
  const payload = token.split('.')[1];
  const decodePayload = JSON.parse(Buffer.from(payload, 'base64').toString('ascii'));
  const jwtCardId = decodePayload.cardId;
  if (jwtCardId !== ctx.request.body.cardId) {
    ctx.body = getResponse('API003');
    ctx.db.$pool.end();
    return;
  }

  const jwtTimestamp = new Date(decodePayload.timestamp);
  const sessionEndTime = new Date(jwtTimestamp.getTime() + (60000 * 10));
  const validSession = new Date() <= sessionEndTime;
  if (validSession === false) {
    ctx.body = getResponse('API004');
    ctx.db.$pool.end();
    return;
  }

  await next();
};

module.exports = authorize;

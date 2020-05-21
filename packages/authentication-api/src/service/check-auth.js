const { getResponse, generateJWT } = require('../../../common');
const checkEncryption = require('../helpers/check-encryption');

const checkAuthDetails = async (ctx, request) => {
  const { cardId, pin } = request;

  try {
    const data = await ctx.db.query(`
      SELECT * FROM T002USER_AUTH WHERE CARD_ID = $1
    `, [cardId]);

    if (data.length > 0) {
      const actualPIN = data[0].pin;
      const validPIN = await checkEncryption(pin.toString(), actualPIN);

      if (data[0].status.trim() === 'ACTIVE') {
        if (validPIN === true) {
          await ctx.db.query('UPDATE T002USER_AUTH SET ATTEMPTS = $2 WHERE CARD_ID = $1', [cardId, 0]);
          const response = getResponse('AUTH002');
          response.token = await generateJWT(cardId);
          return response;
        } else {
          const attempts = parseInt(data[0].attempts) < 3
            ? parseInt(data[0].attempts) + 1
            : parseInt(data[0].attempts);

          await ctx.db.query('UPDATE T002USER_AUTH SET ATTEMPTS = $2 WHERE CARD_ID = $1', [cardId, attempts]);

          if (attempts === 3) {
            await ctx.db.query('UPDATE T002USER_AUTH SET STATUS = $2 WHERE CARD_ID = $1', [cardId, 'FROZEN']);
          }
          return getResponse('AUTH003');
        }
      } else {
        return getResponse('AUTH004');
      }
    } else {
      return getResponse('AUTH006');
    }
  } catch (error) {
    return getResponse('AUTH005');
  } finally {
    ctx.db.$pool.end();
  }
};

module.exports = checkAuthDetails;

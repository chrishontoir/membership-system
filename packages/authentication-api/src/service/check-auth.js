const { getResponse } = require('../../../common');
const checkEncryption = require('../helpers/check-encryption');
const { generateJWT } = require('../../../common');

const checkAuthDetails = async (ctx, request) => {
  const { cardId, pin } = request;

  return await ctx.db.query('SELECT * FROM T002USER_AUTH WHERE CARD_ID = $1', [cardId])
    .then(async authDetails => {
      if (authDetails.length === 0) {
        return getResponse('AUTH006');
      }
      const actualPIN = authDetails[0].pin;
      const validPIN = await checkEncryption(pin.toString(), actualPIN);

      if (authDetails[0].status.trim() === 'ACTIVE') {
        if (validPIN === true) {
          await ctx.db.query('UPDATE T002USER_AUTH SET ATTEMPTS = $2 WHERE CARD_ID = $1', [cardId, 0]);
          const response = getResponse('AUTH002');
          response.token = await generateJWT(cardId);
          return response;
        } else {
          const attempts = parseInt(authDetails[0].attempts) < 3
            ? parseInt(authDetails[0].attempts) + 1
            : parseInt(authDetails[0].attempts);

          await ctx.db.query('UPDATE T002USER_AUTH SET ATTEMPTS = $2 WHERE CARD_ID = $1', [cardId, attempts]);

          if (attempts === 3) {
            await ctx.db.query('UPDATE T002USER_AUTH SET STATUS = $2 WHERE CARD_ID = $1', [cardId, 'FROZEN']);
          }
          return getResponse('AUTH003');
        }
      } else {
        return getResponse('AUTH004');
      }
    })
    .catch(error => {
      console.log(error);
      return getResponse('AUTH005', { error: error.detail });
    })
    .finally(ctx.db.$pool.end);
};

module.exports = checkAuthDetails;

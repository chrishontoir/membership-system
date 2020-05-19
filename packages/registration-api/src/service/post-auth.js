const getResponse = require('../../../common/src/responses');
const encrypt = require('../helpers/encrypt');

const postAuthDetails = async (ctx, request) => {
  const { cardId, pin } = request;

  const encryptedPIN = await encrypt(pin.toString())

  return await ctx.db.query(`INSERT INTO T002USER_AUTH (
      CARD_ID, PIN, STATUS, ATTEMPTS
    ) VALUES (
      $1, $2, $3, $4
    ) ON CONFLICT (CARD_ID) DO UPDATE SET PIN = $2, STATUS = $3, ATTEMPTS = $4;
  `, [cardId, encryptedPIN, 'ACTIVE', 0]
  ).then(user => {
    const response = getResponse('SEC002')
    console.log(response)
    return response;
  })
  .catch(error => {
    if (error.code === '23503') {
      const response = getResponse('SEC003')
      console.log(response)
      return response;
    } else if (error.code === '22001') {
      const response = getResponse('SEC004')
      console.log(response)
      return response;
    } else {
      const response = getResponse('SEC005')
      console.log({ ...response, error: error.detail })
      return response;
    }
  })
  .finally(ctx.db.$pool.end);
};

module.exports = postAuthDetails;

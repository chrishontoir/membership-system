const { getResponse } = require('../../../common');
const encrypt = require('../helpers/encrypt');

const postAuthDetails = async (ctx, request) => {
  const { cardId, pin } = request;

  const encryptedPIN = await encrypt(pin.toString());

  try {
    const data = await ctx.db.query(`
      INSERT INTO T002USER_AUTH (CARD_ID, PIN, STATUS, ATTEMPTS) 
      VALUES ($1, $2, $3, $4) 
      ON CONFLICT (CARD_ID) DO 
      UPDATE SET PIN = $2, STATUS = $3, ATTEMPTS = $4;
    `, [cardId, encryptedPIN, 'ACTIVE', 0]);

    if (data) {
      return getResponse('SEC002');
    } else {
      return getResponse('SEC005');
    }
  } catch (error) {
    if (error.code === '23503') {
      return getResponse('SEC003');
    } else if (error.code === '22001') {
      return getResponse('SEC004');
    } else {
      return getResponse('SEC005');
    }
  } finally {
    ctx.db.$pool.end();
  }
};

module.exports = postAuthDetails;

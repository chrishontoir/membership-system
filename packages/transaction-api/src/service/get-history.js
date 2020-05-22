const { getResponse } = require('../../../common');
const format = require('../helpers/format');

const getHistory = async (ctx, request) => {
  const { cardId } = request;

  try {
    const data = await ctx.db.query(`
      SELECT * FROM T004ACCOUNT_HISTORY WHERE CARD_ID = $1;
    `, [cardId]);

    if (data.length > 0) {
      const response = getResponse('TRAN022');
      response.history = format(data);
      return response;
    } else {
      return getResponse('TRAN023');
    }
  } catch (error) {
    return getResponse('TRAN025');
  } finally {
    ctx.db.$pool.end();
  }
};

module.exports = getHistory;

const getResponse = require('../../../common/src/responses');
const format = require('../helpers/format');

const getHistory = async (ctx, request) => {
  const { cardId } = request;

  return ctx.db.query('SELECT * FROM T004ACCOUNT_HISTORY WHERE CARD_ID = $1;', [cardId])
    .then(async accountHistory => {
      const response = getResponse('TRAN022');
      response.history = format(accountHistory);
      return response;
    })
    .catch(error => {
      console.log(error);
      return getResponse('TRAN025');
    })
    .finally(ctx.db.$pool.end);
};

module.exports = getHistory;

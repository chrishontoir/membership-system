const getResponse = require('../../../common/src/responses');

const postPurchase = async (ctx, request) => {
  let { cardId, description, amount } = request;

  const date = new Date().toISOString();

  return ctx.db.query('SELECT * FROM T003ACCOUNT_BALANCE WHERE CARD_ID = $1;', [cardId])
    .then(async account => {
      if (account.length === 0 || account[0].balance < amount) {
        return getResponse('TRAN014');
      } else {
        amount = parseFloat(account[0].balance) - amount;
        await ctx.db.query('UPDATE T003ACCOUNT_BALANCE SET BALANCE = $2 WHERE CARD_ID = $1;', [cardId, amount]);
        await ctx.db.query('INSERT INTO T004ACCOUNT_HISTORY (CARD_ID, DESCRIPTION, AMOUNT, DATE) VALUES ($1, $2, $3, $4);', [cardId, description, request.amount, date]);
      }
      const response = getResponse('TRAN012');
      response.balance = parseFloat(amount).toFixed(2);
      return response;
    })
    .catch(error => {
      console.log(error);
      if (error.code === '23503') {
        return getResponse('TRAN013');
      } else {
        return getResponse('TRAN015');
      }
    })
    .finally(ctx.db.$pool.end);
};

module.exports = postPurchase;

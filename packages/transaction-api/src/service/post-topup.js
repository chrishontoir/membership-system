const getResponse = require('../../../common/src/responses');

const postTopup = async (ctx, request) => {
  const { cardId, description, amount } = request;

  const date = new Date().toISOString();

  return ctx.db.query('SELECT * FROM T003ACCOUNT_BALANCE WHERE CARD_ID = $1;', [cardId])
    .then(async account => {
      if (account.length === 0) {
        await ctx.db.query('INSERT INTO T003ACCOUNT_BALANCE (CARD_ID, BALANCE) VALUES ($1, $2);', [cardId, amount]);
      } else {
        const updatedAmount = parseFloat(account[0].balance) + amount;
        await ctx.db.query('UPDATE T003ACCOUNT_BALANCE SET BALANCE = $2 WHERE CARD_ID = $1;', [cardId, updatedAmount]);
      }
      return getResponse('TRAN002');
    })
    .catch(error => {
      console.log(error);
      if (error.code === '23505') {
        return getResponse('TRAN003');
      } else if (error.code === '22001') {
        return getResponse('TRAN004');
      } else {
        return getResponse('TRAN005');
      }
    })
    .finally(ctx.db.$pool.end);
};

module.exports = postTopup;

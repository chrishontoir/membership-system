const { getResponse } = require('../../../common');

const postPurchase = async (ctx, request) => {
  const { cardId, description, amount } = request;

  const date = new Date().toISOString();

  try {
    const data = await ctx.db.query(`
      SELECT * FROM T003ACCOUNT_BALANCE WHERE CARD_ID = $1;
    `, [cardId]);

    if (data.length > 0 && data[0].balance >= amount) {
      const balance = parseFloat(data[0].balance) - amount;

      await ctx.db.query(`
        UPDATE T003ACCOUNT_BALANCE SET BALANCE = $2 WHERE CARD_ID = $1;
      `, [cardId, balance]);

      await ctx.db.query(
        `INSERT INTO T004ACCOUNT_HISTORY (CARD_ID, DESCRIPTION, AMOUNT, DATE) VALUES ($1, $2, $3, $4);
      `, [cardId, description, request.amount, date]);

      const response = getResponse('TRAN012');
      response.balance = parseFloat(balance).toFixed(2);
      return response;
    } else {
      return getResponse('TRAN014');
    }
  } catch (error) {
    if (error.code === '23503') {
      return getResponse('TRAN013');
    } else {
      return getResponse('TRAN015');
    }
  } finally {
    ctx.db.$pool.end();
  }
};

module.exports = postPurchase;

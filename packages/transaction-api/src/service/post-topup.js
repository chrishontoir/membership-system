const { getResponse } = require('../../../common');

const postTopup = async (ctx, request) => {
  const { cardId, description, amount } = request;

  const date = new Date().toISOString();

  try {
    const data = await ctx.db.query(`
      SELECT * FROM T003ACCOUNT_BALANCE WHERE CARD_ID = $1;
    `, [cardId]);

    let balance = parseFloat(amount);

    if (data.length > 0) {
      balance = parseFloat(data[0].balance) + amount;
      await ctx.db.query(`
        UPDATE T003ACCOUNT_BALANCE SET BALANCE = $2 WHERE CARD_ID = $1;
      `, [cardId, balance]);
    } else {
      await ctx.db.query(`
        INSERT INTO T003ACCOUNT_BALANCE (CARD_ID, BALANCE) VALUES ($1, $2);
      `, [cardId, amount]);
    }
    await ctx.db.query(`
      INSERT INTO T004ACCOUNT_HISTORY (CARD_ID, DESCRIPTION, AMOUNT, DATE) VALUES ($1, $2, $3, $4);
    `, [cardId, description, amount, date]);

    const response = getResponse('TRAN002');
    response.balance = parseFloat(balance).toFixed(2);
    return response;
  } catch (error) {
    if (error.code === '23503') {
      return getResponse('TRAN003');
    } else {
      return getResponse('TRAN005');
    }
  } finally {
    ctx.db.$pool.end();
  }
};

module.exports = postTopup;

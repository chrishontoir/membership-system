const getHistoryDetails = require('../service/get-history');

const history = async ctx => {
  const getHistory = await getHistoryDetails(ctx, ctx.request.body);

  ctx.body = {
    code: getHistory.code,
    message: getHistory.message
  };

  if (getHistory.history) {
    ctx.body = { ...ctx.body, history: getHistory.history };
  }
};

module.exports = history;

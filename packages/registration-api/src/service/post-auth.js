const getResponse = require('../../../common/src/responses');

const postAuthDetails = async (ctx, request) => {
  const { cardId, pin } = request;

  return ctx.db.query(`INSERT INTO T002USER_AUTH (
      CARD_ID, PIN, STATUS, ATTEMPTS
    ) VALUES (
      $1, $2, $3, $4
    ) ON CONFLICT (CARD_ID) DO UPDATE SET PIN = $2;
  `, [cardId, pin, 'ACTIVE', 0]
  ).then(user => {
    const response = getResponse('AUTH002')
    console.log(response)
    return response;
  })
  .catch(error => {
    if (error.code === '22001') {
      const response = getResponse('AUTH004')
      console.log(response)
      return response;
    } else {
      const response = getResponse('AUTH005')
      console.log(response)
      return response;
    }
  })
  .finally(ctx.db.$pool.end);
};

module.exports = postAuthDetails;

const getResponse = require('../../../common/src/responses');

const postUserDetails = async (ctx, request) => {
  const { cardId, employeeId, firstName, lastName, email, mobileNo } = request;

  return ctx.db.query(`INSERT INTO T001USER_DETAILS (
      CARD_ID, EMPLOYEE_ID, FIRST_NAME, LAST_NAME, EMAIL, MOBILE_NO, DATE_OF_REG
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7
      );
  `, [cardId, employeeId, firstName, lastName, email, mobileNo, '2020-01-01']
  ).then(user => {
    const response = getResponse('REG002')
    console.log(response)
    return response;
  })
  .catch(error => {
    if (error.code === '23505') {
      const response = getResponse('REG003')
      console.log(response)
      return response;
    } else if (error.code === '22001') {
      const response = getResponse('REG004')
      console.log(response)
      return response;
    } else {
      const response = getResponse('REG005')
      console.log({ ...response, error: error.detail })
      return response;
    }
  })
  .finally(ctx.db.$pool.end);
};

module.exports = postUserDetails;

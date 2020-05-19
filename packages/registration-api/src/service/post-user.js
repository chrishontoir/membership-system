const getResponse = require('../../../common/src/responses');

const postUserDetails = async (ctx, request) => {
  const { cardId, employeeId, firstName, lastName, email, mobileNo } = request;

  return ctx.db.query(`
  INSERT INTO T001USER_DETAILS (CARD_ID, EMPLOYEE_ID, FIRST_NAME, LAST_NAME, EMAIL, MOBILE_NO, DATE_OF_REG) 
  VALUES ($1, $2, $3, $4, $5, $6, $7);
  `, [cardId, employeeId, firstName, lastName, email, mobileNo, '2020-01-01'])
    .then(userDetails => {
      return getResponse('REG002');
    })
    .catch(error => {
      if (error.code === '23505') {
        return getResponse('REG003');
      } else if (error.code === '22001') {
        return getResponse('REG004');
      } else {
        return getResponse('REG005');
      }
    })
    .finally(ctx.db.$pool.end);
};

module.exports = postUserDetails;

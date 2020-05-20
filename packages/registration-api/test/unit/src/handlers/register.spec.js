const assert = require('assert');
const td = require('testdouble');

const ctx = {
  request: {
    body: 'testBody'
  }
};

const addUser = {
  code: 'REG002',
  message: 'Card registered successfully'
};

describe('registration-api / handlers / register', () => {
  describe('should call postUserDetails', () => {
    beforeEach(async () => {
      this.postUserDetails = td.function();
      td.replace('../../../../src/service/post-user', this.postUserDetails);
      td.when(this.postUserDetails(ctx, ctx.request.body)).thenResolve(addUser);

      this.sut = require('../../../../src/handlers/register');
    });
    afterEach(td.reset);

    it('and set the response in the ctx.body', async () => {
      await this.sut(ctx);
      assert.deepStrictEqual(ctx.body.code, 'REG002');
      assert.deepStrictEqual(ctx.body.message, 'Card registered successfully');
    });
  });
});

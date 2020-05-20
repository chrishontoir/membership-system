const assert = require('assert');
const td = require('testdouble');

const ctx = {
  request: {
    body: 'testBody'
  }
};

const addAuth = {
  code: 'SEC002',
  message: 'PIN set successfully'
};

describe('registration-api / handlers / secure', () => {
  describe('should call postAuthDetails', () => {
    beforeEach(async () => {
      this.postAuthDetails = td.function();
      td.replace('../../../../src/service/post-auth', this.postAuthDetails);
      td.when(this.postAuthDetails(ctx, ctx.request.body)).thenResolve(addAuth);

      this.sut = require('../../../../src/handlers/secure');
    });
    afterEach(td.reset);

    it('and set the response in the ctx.body', async () => {
      await this.sut(ctx);
      assert.deepStrictEqual(ctx.body.code, 'SEC002');
      assert.deepStrictEqual(ctx.body.message, 'PIN set successfully');
    });
  });
});

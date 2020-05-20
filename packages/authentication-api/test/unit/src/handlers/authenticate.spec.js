const assert = require('assert');
const td = require('testdouble');

const ctx = {
  request: {
    body: 'testBody'
  }
};

const checkAuth = {
  code: 'AUTH003',
  message: 'Invalid PIN'
};

const checkAuthWithToken = {
  code: 'AUTH002',
  message: 'Authenticated',
  token: 'abcde.fghij.lmnop'
};

describe('authentication-api / handlers / authenticate', () => {
  beforeEach(() => {
    this.checkAuthDetails = td.function();
    td.replace('../../../../src/service/check-auth', this.checkAuthDetails);

    this.sut = require('../../../../src/handlers/authenticate');
  });
  afterEach(td.reset);

  describe('should call checkAuthDetails with valid details', () => {
    beforeEach(async () => {
      td.when(this.checkAuthDetails(ctx, ctx.request.body)).thenResolve(checkAuthWithToken);
      await this.sut(ctx);
    });

    it.only('and set the response in the ctx.body', () => {
      assert.deepStrictEqual(ctx.body.code, 'AUTH002');
      assert.deepStrictEqual(ctx.body.message, 'Authenticated');
      assert.deepStrictEqual(ctx.body.token, 'abcde.fghij.lmnop');
    });
  });

  describe('should call checkAuthDetails with invalid details', () => {
    beforeEach(async () => {
      td.when(this.checkAuthDetails(ctx, ctx.request.body)).thenResolve(checkAuth);
      await this.sut(ctx);
    });

    it.only('and set the response in the ctx.body', () => {
      assert.deepStrictEqual(ctx.body.code, 'AUTH003');
      assert.deepStrictEqual(ctx.body.message, 'Invalid PIN');
      assert.deepStrictEqual(ctx.body.token, undefined);
    });
  });
});

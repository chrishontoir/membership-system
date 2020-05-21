const assert = require('assert');
const td = require('testdouble');

const ctx = {
  request: {
    body: 'testBody'
  }
};

const postTopup = {
  code: 'TRAN002',
  message: 'Successful Topup'
};

const postTopupWithBalance = {
  code: 'TRAN002',
  message: 'Successful Topup',
  balance: 10.12
};

describe('transaction-api / handlers / topup', () => {
  describe('should call postTopupDetails with invalid details', () => {
    beforeEach(async () => {
      this.postTopupDetails = td.function();
      td.replace('../../../../src/service/post-topup', this.postTopupDetails);
      td.when(this.postTopupDetails(ctx, ctx.request.body)).thenResolve(postTopup);

      this.sut = require('../../../../src/handlers/topup');
    });
    afterEach(td.reset);

    it('and set the response in the ctx.body without a balance', async () => {
      await this.sut(ctx);
      assert.deepStrictEqual(ctx.body.code, 'TRAN002');
      assert.deepStrictEqual(ctx.body.message, 'Successful Topup');
      assert.deepStrictEqual(ctx.body.balance, undefined);
    });
  });

  describe('should call postTopupDetails with valid details', () => {
    beforeEach(async () => {
      this.postTopupDetails = td.function();
      td.replace('../../../../src/service/post-topup', this.postTopupDetails);
      td.when(this.postTopupDetails(ctx, ctx.request.body)).thenResolve(postTopupWithBalance);

      this.sut = require('../../../../src/handlers/topup');
    });
    afterEach(td.reset);

    it('and set the response in the ctx.body with a balance', async () => {
      await this.sut(ctx);
      assert.deepStrictEqual(ctx.body.code, 'TRAN002');
      assert.deepStrictEqual(ctx.body.message, 'Successful Topup');
      assert.deepStrictEqual(ctx.body.balance, 10.12);
    });
  });
});

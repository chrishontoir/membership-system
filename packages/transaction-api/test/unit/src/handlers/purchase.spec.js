const assert = require('assert');
const td = require('testdouble');

const ctx = {
  request: {
    body: 'testBody'
  }
};

const postPurchase = {
  code: 'TRAN012',
  message: 'Successful Purchase'
};

const postPurchaseWithBalance = {
  code: 'TRAN012',
  message: 'Successful Purchase',
  balance: 15.43
};

describe('transaction-api / handlers / purchase', () => {
  describe('should call postPurchaseDetails with invalid details', () => {
    beforeEach(async () => {
      this.postPurchaseDetails = td.function();
      td.replace('../../../../src/service/post-purchase', this.postPurchaseDetails);
      td.when(this.postPurchaseDetails(ctx, ctx.request.body)).thenResolve(postPurchase);

      this.sut = require('../../../../src/handlers/purchase');
    });
    afterEach(td.reset);

    it('and set the response in the ctx.body without a balance', async () => {
      await this.sut(ctx);
      assert.deepStrictEqual(ctx.body.code, 'TRAN012');
      assert.deepStrictEqual(ctx.body.message, 'Successful Purchase');
      assert.deepStrictEqual(ctx.body.balance, undefined);
    });
  });

  describe('should call postPurchaseDetails with valid details', () => {
    beforeEach(async () => {
      this.postPurchaseDetails = td.function();
      td.replace('../../../../src/service/post-purchase', this.postPurchaseDetails);
      td.when(this.postPurchaseDetails(ctx, ctx.request.body)).thenResolve(postPurchaseWithBalance);

      this.sut = require('../../../../src/handlers/purchase');
    });
    afterEach(td.reset);

    it('and set the response in the ctx.body with a balance', async () => {
      await this.sut(ctx);
      assert.deepStrictEqual(ctx.body.code, 'TRAN012');
      assert.deepStrictEqual(ctx.body.message, 'Successful Purchase');
      assert.deepStrictEqual(ctx.body.balance, 15.43);
    });
  });
});

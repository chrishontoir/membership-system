const assert = require('assert');
const td = require('testdouble');

const ctx = {
  request: {
    body: 'testBody'
  }
};

const getHistory = {
  code: 'TRAN022',
  message: 'Transaction history retrieved'
};

const getHistoryWithTransactions = {
  code: 'TRAN022',
  message: 'Transaction history retrieved',
  history: []
};

describe('transaction-api / handlers / history', () => {
  describe('should call getHistoryDetails with invalid details', () => {
    beforeEach(async () => {
      this.getHistoryDetails = td.function();
      td.replace('../../../../src/service/get-history', this.getHistoryDetails);
      td.when(this.getHistoryDetails(ctx, ctx.request.body)).thenResolve(getHistory);

      this.sut = require('../../../../src/handlers/history');
    });
    afterEach(td.reset);

    it('and set the response in the ctx.body without a history', async () => {
      await this.sut(ctx);
      assert.deepStrictEqual(ctx.body.code, 'TRAN022');
      assert.deepStrictEqual(ctx.body.message, 'Transaction history retrieved');
      assert.deepStrictEqual(ctx.body.history, undefined);
    });
  });

  describe('should call getHistoryDetails with valid details', () => {
    beforeEach(async () => {
      this.getHistoryDetails = td.function();
      td.replace('../../../../src/service/get-history', this.getHistoryDetails);
      td.when(this.getHistoryDetails(ctx, ctx.request.body)).thenResolve(getHistoryWithTransactions);

      this.sut = require('../../../../src/handlers/history');
    });
    afterEach(td.reset);

    it('and set the response in the ctx.body with a history', async () => {
      await this.sut(ctx);
      assert.deepStrictEqual(ctx.body.code, 'TRAN022');
      assert.deepStrictEqual(ctx.body.message, 'Transaction history retrieved');
      assert.deepStrictEqual(ctx.body.history, []);
    });
  });
});

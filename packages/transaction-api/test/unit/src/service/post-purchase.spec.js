const assert = require('assert');
const td = require('testdouble');

describe('transaction-api / service / post-purchase', () => {
  beforeEach(() => {
    this.ctx = {
      db: {
        query: td.function(),
        $pool: {
          end: td.function()
        }
      }
    };

    this.request = {
      cardId: '1234567890123456',
      description: 'Purchase',
      amount: 4.80
    };

    this.common = {
      getResponse: td.function()
    };
    td.replace('../../../../../common/', this.common);

    this.sut = require('../../../../src/service/post-purchase');
  });
  afterEach(td.reset);

  describe('when given valid purchase details of a registered card with enough funds', () => {
    beforeEach(() => {
      td.when(this.ctx.db.query(td.matchers.contains('SELECT * FROM T003ACCOUNT_BALANCE'), td.matchers.isA(Array))).thenReturn([{ cardId: '1234567890123456', balance: 5.00 }]);
      td.when(this.ctx.db.query(td.matchers.contains('UPDATE T003ACCOUNT_BALANCE SET BALANCE'), td.matchers.isA(Array))).thenReturn([]);
      td.when(this.ctx.db.query(td.matchers.contains('INSERT INTO T004ACCOUNT_HISTORY'), td.matchers.isA(Array))).thenReturn([]);
      td.when(this.common.getResponse('TRAN012')).thenReturn({ code: 'TRAN012', message: 'Purchase successful' });
    });

    it('should respond with a TRAN012 message', async () => {
      this.response = await this.sut(this.ctx, this.request);
      assert.deepStrictEqual(this.response.code, 'TRAN012');
      assert.deepStrictEqual(this.response.message, 'Purchase successful');
      assert.deepStrictEqual(this.response.balance, '0.20');
    });
  });

  describe('when given valid purchase details of a registered card with not enough funds', () => {
    beforeEach(() => {
      td.when(this.ctx.db.query(td.matchers.contains('SELECT * FROM T003ACCOUNT_BALANCE'), td.matchers.isA(Array))).thenReturn([{ cardId: '1234567890123456', balance: 4.79 }]);
      td.when(this.common.getResponse('TRAN014')).thenReturn({ code: 'TRAN014', message: 'Not enough funds' });
    });

    it('should respond with a TRAN014 message', async () => {
      this.response = await this.sut(this.ctx, this.request);
      assert.deepStrictEqual(this.response.code, 'TRAN014');
      assert.deepStrictEqual(this.response.message, 'Not enough funds');
      assert.deepStrictEqual(this.response.balance, undefined);
    });
  });

  describe('when given an unregistered card', () => {
    beforeEach(() => {
      td.when(this.ctx.db.query(td.matchers.contains('SELECT * FROM T003ACCOUNT_BALANCE'), td.matchers.isA(Array))).thenReject({ code: '23503' });
      td.when(this.common.getResponse('TRAN013')).thenReturn({ code: 'TRAN013', message: 'Card not registered' });
    });

    it('should respond with a TRAN013 message', async () => {
      this.response = await this.sut(this.ctx, this.request);
      assert.deepStrictEqual(this.response.code, 'TRAN013');
      assert.deepStrictEqual(this.response.message, 'Card not registered');
      assert.deepStrictEqual(this.response.balance, undefined);
    });
  });

  describe('when any other error occurs', () => {
    beforeEach(() => {
      td.when(this.ctx.db.query(td.matchers.isA(String), td.matchers.isA(Array))).thenReject({ code: '28561' });
      td.when(this.common.getResponse('TRAN015')).thenReturn({ code: 'TRAN015', message: 'Application Error' });
    });

    it('should respond with a TRAN015 message', async () => {
      this.response = await this.sut(this.ctx, this.request);
      assert.deepStrictEqual(this.response.code, 'TRAN015');
      assert.deepStrictEqual(this.response.message, 'Application Error');
      assert.deepStrictEqual(this.response.history, undefined);
    });
  });
});

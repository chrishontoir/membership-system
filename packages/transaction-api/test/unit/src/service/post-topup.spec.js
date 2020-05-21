const assert = require('assert');
const td = require('testdouble');

describe('transaction-api / service / post-topup', () => {
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
      description: 'Topup',
      amount: 5.10
    };

    this.common = {
      getResponse: td.function()
    };
    td.replace('../../../../../common/', this.common);

    this.sut = require('../../../../src/service/post-topup');
  });
  afterEach(td.reset);

  describe('when given valid topup details of a registered card with an existing balance', () => {
    beforeEach(() => {
      td.when(this.ctx.db.query(td.matchers.contains('SELECT * FROM T003ACCOUNT_BALANCE'), td.matchers.isA(Array))).thenReturn([{ cardId: '1234567890123456', balance: 4.90 }]);
      td.when(this.ctx.db.query(td.matchers.contains('UPDATE T003ACCOUNT_BALANCE SET BALANCE'), td.matchers.isA(Array))).thenReturn([]);
      td.when(this.ctx.db.query(td.matchers.contains('INSERT INTO T004ACCOUNT_HISTORY'), td.matchers.isA(Array))).thenReturn([]);
      td.when(this.common.getResponse('TRAN002')).thenReturn({ code: 'TRAN002', message: 'Topup successful' });
    });

    it('should respond with a TRAN002 message', async () => {
      this.response = await this.sut(this.ctx, this.request);
      assert.deepStrictEqual(this.response.code, 'TRAN002');
      assert.deepStrictEqual(this.response.message, 'Topup successful');
      assert.deepStrictEqual(this.response.balance, '10.00');
    });
  });

  describe('when given valid topup details of a registered card with no existing balance', () => {
    beforeEach(() => {
      td.when(this.ctx.db.query(td.matchers.contains('SELECT * FROM T003ACCOUNT_BALANCE'), td.matchers.isA(Array))).thenReturn([]);
      td.when(this.ctx.db.query(td.matchers.contains('INSERT INTO T003ACCOUNT_BALANCE'), td.matchers.isA(Array))).thenReturn([]);
      td.when(this.ctx.db.query(td.matchers.contains('INSERT INTO T004ACCOUNT_HISTORY'), td.matchers.isA(Array))).thenReturn([]);
      td.when(this.common.getResponse('TRAN002')).thenReturn({ code: 'TRAN002', message: 'Topup successful' });
    });

    it('should respond with a TRAN002 message', async () => {
      this.response = await this.sut(this.ctx, this.request);
      assert.deepStrictEqual(this.response.code, 'TRAN002');
      assert.deepStrictEqual(this.response.message, 'Topup successful');
      assert.deepStrictEqual(this.response.balance, '5.10');
    });
  });

  describe('when given an unregistered card', () => {
    beforeEach(() => {
      td.when(this.ctx.db.query(td.matchers.contains('SELECT * FROM T003ACCOUNT_BALANCE'), td.matchers.isA(Array))).thenReject({ code: '23503' });
      td.when(this.common.getResponse('TRAN003')).thenReturn({ code: 'TRAN003', message: 'Card not registered' });
    });

    it('should respond with a TRAN003 message', async () => {
      this.response = await this.sut(this.ctx, this.request);
      assert.deepStrictEqual(this.response.code, 'TRAN003');
      assert.deepStrictEqual(this.response.message, 'Card not registered');
      assert.deepStrictEqual(this.response.balance, undefined);
    });
  });

  describe('when any other error occurs', () => {
    beforeEach(() => {
      td.when(this.ctx.db.query(td.matchers.isA(String), td.matchers.isA(Array))).thenReject({ code: '28561' });
      td.when(this.common.getResponse('TRAN005')).thenReturn({ code: 'TRAN005', message: 'Application Error' });
    });

    it('should respond with a TRAN005 message', async () => {
      this.response = await this.sut(this.ctx, this.request);
      assert.deepStrictEqual(this.response.code, 'TRAN005');
      assert.deepStrictEqual(this.response.message, 'Application Error');
      assert.deepStrictEqual(this.response.history, undefined);
    });
  });
});

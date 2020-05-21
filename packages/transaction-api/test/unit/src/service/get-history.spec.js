const assert = require('assert');
const td = require('testdouble');

describe('transaction-api / service / get-history', () => {
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
      cardId: '1234567890123456'
    };

    this.common = {
      getResponse: td.function()
    };
    td.replace('../../../../../common/', this.common);

    this.format = td.function();
    td.replace('../../../../src/helpers/format', this.format);

    this.sut = require('../../../../src/service/get-history');
  });
  afterEach(td.reset);

  describe('when given valid details of a registered card with a transaction history', () => {
    beforeEach(() => {
      td.when(this.ctx.db.query(td.matchers.isA(String), td.matchers.isA(Array))).thenReturn([{ id: 1 }]);
      td.when(this.format([{ id: 1 }])).thenReturn([{ id: 1 }]);
      td.when(this.common.getResponse('TRAN022')).thenReturn({ code: 'TRAN022', message: 'Transaction history retrieved' });
    });

    it('should respond with a TRAN022 message', async () => {
      this.response = await this.sut(this.ctx, this.request);
      assert.deepStrictEqual(this.response.code, 'TRAN022');
      assert.deepStrictEqual(this.response.message, 'Transaction history retrieved');
      assert.deepStrictEqual(this.response.history, [{ id: 1 }]);
    });
  });

  describe('when given valid details of a registered card with no transaction history', () => {
    beforeEach(() => {
      td.when(this.ctx.db.query(td.matchers.isA(String), td.matchers.isA(Array))).thenReturn([]);
      td.when(this.format([])).thenReturn([]);
      td.when(this.common.getResponse('TRAN023')).thenReturn({ code: 'TRAN023', message: 'No transactions found' });
    });

    it('should respond with a TRAN023 message', async () => {
      this.response = await this.sut(this.ctx, this.request);
      assert.deepStrictEqual(this.response.code, 'TRAN023');
      assert.deepStrictEqual(this.response.message, 'No transactions found');
      assert.deepStrictEqual(this.response.history, undefined);
    });
  });

  describe('when any other error occurs', () => {
    beforeEach(() => {
      td.when(this.ctx.db.query(td.matchers.isA(String), td.matchers.isA(Array))).thenReject({ code: '28561' });
      td.when(this.common.getResponse('TRAN025')).thenReturn({ code: 'TRAN025', message: 'Application Error' });
    });

    it('should respond with a TRAN025 message', async () => {
      this.response = await this.sut(this.ctx, this.request);
      assert.deepStrictEqual(this.response.code, 'TRAN025');
      assert.deepStrictEqual(this.response.message, 'Application Error');
      assert.deepStrictEqual(this.response.history, undefined);
    });
  });
});

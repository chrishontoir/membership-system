const assert = require('assert');
const td = require('testdouble');

describe('authentication-api / service / check-auth', () => {
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
      pin: 1234
    };

    this.activeResponse = [{
      cardId: '1234567890123456',
      pin: '$2b$10$cU4xaaphWXjEOqMlqHSLWux8q0IBKQ8vMQZ7vxQs7GxwD6/uzrvzC',
      status: 'ACTIVE',
      attempts: 0
    }];

    this.activeResponse2 = [{
      cardId: '1234567890123456',
      pin: '$2b$10$cU4xaaphWXjEOqMlqHSLWux8q0IBKQ8vMQZ7vxQs7GxwD6/uzrvzC',
      status: 'ACTIVE',
      attempts: 2
    }];

    this.activeResponse3 = [{
      cardId: '1234567890123456',
      pin: '$2b$10$cU4xaaphWXjEOqMlqHSLWux8q0IBKQ8vMQZ7vxQs7GxwD6/uzrvzC',
      status: 'ACTIVE',
      attempts: 3
    }];

    this.frozenResponse = [{
      cardId: '1234567890123456',
      pin: '$2b$10$cU4xaaphWXjEOqMlqHSLWux8q0IBKQ8vMQZ7vxQs7GxwD6/uzrvzC',
      status: 'FROZEN',
      attempts: 3
    }];

    this.checkEncryption = td.function();
    td.replace('../../../../src/helpers/check-encryption', this.checkEncryption);

    this.common = {
      getResponse: td.function(),
      generateJWT: td.function()
    };
    td.replace('../../../../../common/', this.common);

    this.sut = require('../../../../src/service/check-auth');
  });
  afterEach(td.reset);

  describe('when the card is ACTIVE', () => {
    describe('and the request has a valid PIN', () => {
      beforeEach(async () => {
        td.when(this.ctx.db.query(td.matchers.contains('SELECT * FROM T002USER_AUTH'), td.matchers.isA(Array))).thenReturn(this.activeResponse);
        td.when(this.checkEncryption('1234', '$2b$10$cU4xaaphWXjEOqMlqHSLWux8q0IBKQ8vMQZ7vxQs7GxwD6/uzrvzC')).thenReturn(true);
        td.when(this.common.getResponse('AUTH002')).thenReturn({ code: 'AUTH002', message: 'Authenticated' });
        td.when(this.common.generateJWT('1234567890123456')).thenReturn('abcde.fghij.klmno');
      });
      afterEach(td.reset);

      it('should respond with an AUTH002 message and a token', async () => {
        this.response = await this.sut(this.ctx, this.request);
        assert.deepStrictEqual(this.response.code, 'AUTH002');
        assert.deepStrictEqual(this.response.message, 'Authenticated');
        assert.deepStrictEqual(this.response.token, 'abcde.fghij.klmno');
      });
    });

    describe('and the request has an invalid PIN and has less than 3 attempts', () => {
      beforeEach(async () => {
        td.when(this.ctx.db.query(td.matchers.contains('SELECT * FROM T002USER_AUTH'), td.matchers.isA(Array))).thenReturn(this.activeResponse);
        td.when(this.ctx.db.query(td.matchers.contains('UPDATE T002USER_AUTH SET ATTEMPTS'), td.matchers.isA(Array))).thenReturn([]);
        td.when(this.checkEncryption('1234', '$2b$10$cU4xaaphWXjEOqMlqHSLWux8q0IBKQ8vMQZ7vxQs7GxwD6/uzrvzC')).thenReturn(false);
        td.when(this.common.getResponse('AUTH003')).thenReturn({ code: 'AUTH003', message: 'Invalid PIN' });
      });
      afterEach(td.reset);

      it('should respond with an AUTH003 message and no token', async () => {
        this.response = await this.sut(this.ctx, this.request);
        assert.deepStrictEqual(this.response.code, 'AUTH003');
        assert.deepStrictEqual(this.response.message, 'Invalid PIN');
        assert.deepStrictEqual(this.response.token, undefined);
      });
    });

    describe('and the request has an invalid PIN and has 3 attempts', () => {
      beforeEach(async () => {
        td.when(this.ctx.db.query(td.matchers.contains('SELECT * FROM T002USER_AUTH'), td.matchers.isA(Array))).thenReturn(this.activeResponse2);
        td.when(this.ctx.db.query(td.matchers.contains('UPDATE T002USER_AUTH SET ATTEMPTS'), td.matchers.isA(Array))).thenReturn([]);
        td.when(this.ctx.db.query(td.matchers.contains('UPDATE T002USER_AUTH SET STATUS'), td.matchers.isA(Array))).thenReturn([]);
        td.when(this.checkEncryption('1234', '$2b$10$cU4xaaphWXjEOqMlqHSLWux8q0IBKQ8vMQZ7vxQs7GxwD6/uzrvzC')).thenReturn(false);
        td.when(this.common.getResponse('AUTH003')).thenReturn({ code: 'AUTH003', message: 'Invalid PIN' });
      });
      afterEach(td.reset);

      it('should respond with an AUTH003 message and no token', async () => {
        this.response = await this.sut(this.ctx, this.request);
        assert.deepStrictEqual(this.response.code, 'AUTH003');
        assert.deepStrictEqual(this.response.message, 'Invalid PIN');
        assert.deepStrictEqual(this.response.token, undefined);
      });
    });

    describe('and the request has an invalid PIN and has more than 3 attempts', () => {
      beforeEach(async () => {
        td.when(this.ctx.db.query(td.matchers.contains('SELECT * FROM T002USER_AUTH'), td.matchers.isA(Array))).thenReturn(this.activeResponse3);
        td.when(this.ctx.db.query(td.matchers.contains('UPDATE T002USER_AUTH SET ATTEMPTS'), td.matchers.isA(Array))).thenReturn([]);
        td.when(this.ctx.db.query(td.matchers.contains('UPDATE T002USER_AUTH SET STATUS'), td.matchers.isA(Array))).thenReturn([]);
        td.when(this.checkEncryption('1234', '$2b$10$cU4xaaphWXjEOqMlqHSLWux8q0IBKQ8vMQZ7vxQs7GxwD6/uzrvzC')).thenReturn(false);
        td.when(this.common.getResponse('AUTH003')).thenReturn({ code: 'AUTH003', message: 'Invalid PIN' });
      });
      afterEach(td.reset);

      it('should respond with an AUTH003 message and no token', async () => {
        this.response = await this.sut(this.ctx, this.request);
        assert.deepStrictEqual(this.response.code, 'AUTH003');
        assert.deepStrictEqual(this.response.message, 'Invalid PIN');
        assert.deepStrictEqual(this.response.token, undefined);
      });
    });
  });

  describe('when the card is FROZEN', () => {
    beforeEach(async () => {
      td.when(this.ctx.db.query(td.matchers.contains('SELECT * FROM T002USER_AUTH'), td.matchers.isA(Array))).thenReturn(this.frozenResponse);
      td.when(this.common.getResponse('AUTH004')).thenReturn({ code: 'AUTH004', message: 'Account Frozen' });
    });
    afterEach(td.reset);

    it('should respond with an AUTH004 message and no token', async () => {
      this.response = await this.sut(this.ctx, this.request);
      assert.deepStrictEqual(this.response.code, 'AUTH004');
      assert.deepStrictEqual(this.response.message, 'Account Frozen');
      assert.deepStrictEqual(this.response.token, undefined);
    });
  });

  describe('when the card hasnt had a PIN set', () => {
    beforeEach(async () => {
      td.when(this.ctx.db.query(td.matchers.contains('SELECT * FROM T002USER_AUTH'), td.matchers.isA(Array))).thenReturn([]);
      td.when(this.common.getResponse('AUTH006')).thenReturn({ code: 'AUTH006', message: 'Card has not been secured with a PIN' });
    });
    afterEach(td.reset);

    it('should respond with an AUTH006 message and no token', async () => {
      this.response = await this.sut(this.ctx, this.request);
      assert.deepStrictEqual(this.response.code, 'AUTH006');
      assert.deepStrictEqual(this.response.message, 'Card has not been secured with a PIN');
      assert.deepStrictEqual(this.response.token, undefined);
    });
  });

  describe('when any other error is returned by the database', () => {
    beforeEach(async () => {
      td.when(this.ctx.db.query(td.matchers.contains('SELECT * FROM T002USER_AUTH'), td.matchers.isA(Array))).thenReject({ code: '28561' });
      td.when(this.common.getResponse('AUTH005')).thenReturn({ code: 'AUTH005', message: 'Application Error' });
    });
    afterEach(td.reset);

    it('should respond with an AUTH005 message and no token', async () => {
      this.response = await this.sut(this.ctx, this.request);
      assert.deepStrictEqual(this.response.code, 'AUTH005');
      assert.deepStrictEqual(this.response.message, 'Application Error');
      assert.deepStrictEqual(this.response.token, undefined);
    });
  });
});

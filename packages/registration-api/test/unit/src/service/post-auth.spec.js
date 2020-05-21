const assert = require('assert');
const td = require('testdouble');

describe('registration-api / service / post-auth', () => {
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

    this.common = {
      getResponse: td.function()
    };
    td.replace('../../../../../common/', this.common);

    this.encrypt = td.function();
    td.replace('../../../../src/helpers/encrypt', this.encrypt);

    this.sut = require('../../../../src/service/post-auth');
  });
  afterEach(td.reset);

  describe('when given valid details of a registered card', () => {
    beforeEach(() => {
      td.when(this.encrypt('1234')).thenReturn('a6sjw7shajsiwksjwhsj');
      td.when(this.ctx.db.query(td.matchers.isA(String), td.matchers.isA(Array))).thenReturn([]);
      td.when(this.common.getResponse('SEC002')).thenReturn({ code: 'SEC002', message: 'PIN set successfully' });
    });

    it('should save the details to the database', async () => {
      this.response = await this.sut(this.ctx, this.request);
      assert.deepStrictEqual(this.response.code, 'SEC002');
      assert.deepStrictEqual(this.response.message, 'PIN set successfully');
    });
  });

  describe('when given valid details of an unregistered card', () => {
    beforeEach(() => {
      td.when(this.encrypt('1234')).thenReturn('a6sjw7shajsiwksjwhsj');
      td.when(this.ctx.db.query(td.matchers.isA(String), td.matchers.isA(Array))).thenReject({ code: '23503' });
      td.when(this.common.getResponse('SEC003')).thenReturn({ code: 'SEC003', message: 'Card not registered' });
    });

    it('should respond with a SEC003 message', async () => {
      this.response = await this.sut(this.ctx, this.request);
      assert.deepStrictEqual(this.response.code, 'SEC003');
      assert.deepStrictEqual(this.response.message, 'Card not registered');
    });
  });

  describe('when given invalid details', () => {
    beforeEach(() => {
      td.when(this.encrypt('1234')).thenReturn('a6sjw7shajsiwksjwhsj');
      td.when(this.ctx.db.query(td.matchers.isA(String), td.matchers.isA(Array))).thenReject({ code: '22001' });
      td.when(this.common.getResponse('SEC004')).thenReturn({ code: 'SEC004', message: 'Invalid data format' });
    });

    it('should respond with a SEC004 message', async () => {
      this.response = await this.sut(this.ctx, this.request);
      assert.deepStrictEqual(this.response.code, 'SEC004');
      assert.deepStrictEqual(this.response.message, 'Invalid data format');
    });
  });

  describe('when any other error occurs', () => {
    beforeEach(() => {
      td.when(this.encrypt('1234')).thenReturn('a6sjw7shajsiwksjwhsj');
      td.when(this.ctx.db.query(td.matchers.isA(String), td.matchers.isA(Array))).thenReject({ code: '28561' });
      td.when(this.common.getResponse('SEC005')).thenReturn({ code: 'SEC005', message: 'Application Error' });
    });

    it('should respond with a SEC005 message', async () => {
      this.response = await this.sut(this.ctx, this.request);
      assert.deepStrictEqual(this.response.code, 'SEC005');
      assert.deepStrictEqual(this.response.message, 'Application Error');
    });
  });

  describe('when the database doesnt respond with an empty array but no error is thrown', () => {
    beforeEach(() => {
      td.when(this.encrypt('1234')).thenReturn('a6sjw7shajsiwksjwhsj');
      td.when(this.ctx.db.query(td.matchers.isA(String), td.matchers.isA(Array))).thenReturn(undefined);
      td.when(this.common.getResponse('SEC005')).thenReturn({ code: 'SEC005', message: 'Application Error' });
    });

    it('should respond with a SEC005 message', async () => {
      this.response = await this.sut(this.ctx, this.request);
      assert.deepStrictEqual(this.response.code, 'SEC005');
      assert.deepStrictEqual(this.response.message, 'Application Error');
    });
  });
});

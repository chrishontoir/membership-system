const assert = require('assert');
const td = require('testdouble');

describe('registration-api / service / post-user', () => {
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
      employeeId: '1234567890',
      firstName: 'Sally',
      lastName: 'Brown',
      email: 'sbrown@testemail.com',
      mobileNo: '01234567890'
    };

    this.getResponse = td.function();
    td.replace('../../../../../common/src/responses', this.getResponse);
    this.sut = require('../../../../src/service/post-user');
  });
  afterEach(td.reset);

  describe('when given valid details of an unregistered card', () => {
    beforeEach(() => {
      td.when(this.ctx.db.query(td.matchers.isA(String), td.matchers.isA(Array))).thenReturn('VALID_RESPONSE');
      td.when(this.getResponse('REG002')).thenReturn({ code: 'REG002', message: 'Card registered successfully' });
    });

    it('should save the details to the database', async () => {
      this.response = await this.sut(this.ctx, this.request);
      assert.deepStrictEqual(this.response.code, 'REG002');
      assert.deepStrictEqual(this.response.message, 'Card registered successfully');
    });
  });

  describe('when given valid details of a registered card', () => {
    beforeEach(() => {
      td.when(this.ctx.db.query(td.matchers.isA(String), td.matchers.isA(Array))).thenReject({ code: '23505' });
      td.when(this.getResponse('REG003')).thenReturn({ code: 'REG003', message: 'Card already registered' });
    });

    it('should respond with a REG003 message', async () => {
      this.response = await this.sut(this.ctx, this.request);
      assert.deepStrictEqual(this.response.code, 'REG003');
      assert.deepStrictEqual(this.response.message, 'Card already registered');
    });
  });

  describe('when given invalid details', () => {
    beforeEach(() => {
      td.when(this.ctx.db.query(td.matchers.isA(String), td.matchers.isA(Array))).thenReject({ code: '22001' });
      td.when(this.getResponse('REG004')).thenReturn({ code: 'REG004', message: 'Invalid data format' });
    });

    it('should respond with a REG004 message', async () => {
      this.response = await this.sut(this.ctx, this.request);
      assert.deepStrictEqual(this.response.code, 'REG004');
      assert.deepStrictEqual(this.response.message, 'Invalid data format');
    });
  });

  describe('when any other error occurs', () => {
    beforeEach(() => {
      td.when(this.ctx.db.query(td.matchers.isA(String), td.matchers.isA(Array))).thenReject({ code: '28561' });
      td.when(this.getResponse('REG005')).thenReturn({ code: 'REG005', message: 'Application Error' });
    });

    it('should respond with a REG005 message', async () => {
      this.response = await this.sut(this.ctx, this.request);
      assert.deepStrictEqual(this.response.code, 'REG005');
      assert.deepStrictEqual(this.response.message, 'Application Error');
    });
  });

  describe('when the database doesnt respond with an empty array but no error is thrown', () => {
    beforeEach(() => {
      td.when(this.ctx.db.query(td.matchers.isA(String), td.matchers.isA(Array))).thenReturn(undefined);
      td.when(this.getResponse('REG005')).thenReturn({ code: 'REG005', message: 'Application Error' });
    });

    it('should respond with a REG005 message', async () => {
      this.response = await this.sut(this.ctx, this.request);
      assert.deepStrictEqual(this.response.code, 'REG005');
      assert.deepStrictEqual(this.response.message, 'Application Error');
    });
  });
});

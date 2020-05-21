const assert = require('assert');

describe('common / get-response', () => {
  this.sut = require('../../../src/get-response');

  describe('when passed a known code', () => {
    beforeEach(() => {
      this.response = this.sut('API001');
    });

    it('should respond with the correct code and message', () => {
      assert.deepStrictEqual(this.response.code, 'API001');
      assert.deepStrictEqual(this.response.message, 'API Elapsed Time');
      assert.deepStrictEqual(this.response.timestamp !== undefined, true);
    });
  });

  describe('when passed an unknown code', () => {
    beforeEach(() => {
      this.response = this.sut('API006');
    });

    it('should respond with the correct code and message', () => {
      assert.deepStrictEqual(this.response.code, 'API006');
      assert.deepStrictEqual(this.response.message, undefined);
      assert.deepStrictEqual(this.response.timestamp !== undefined, true);
    });
  });
});

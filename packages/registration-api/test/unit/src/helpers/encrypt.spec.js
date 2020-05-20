const assert = require('assert');

const data = '1234';

describe('registration-api / helpers / encrypt', () => {
  describe('when called with some data', () => {
    this.sut = require('../../../../src/helpers/encrypt');

    it('should encrypt it to 60 characters', async () => {
      this.response = await this.sut(data);
      assert.deepStrictEqual(this.response.length, 60);
    });
  });
});

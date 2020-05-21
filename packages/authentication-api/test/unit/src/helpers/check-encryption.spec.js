const assert = require('assert');

const encryptedData = '$2b$10$cU4xaaphWXjEOqMlqHSLWux8q0IBKQ8vMQZ7vxQs7GxwD6/uzrvzC';

describe('authentication-api / helpers / check-encryption', () => {
  describe('when called with some encrypteed data', () => {
    this.sut = require('../../../../src/helpers/check-encryption');

    it('should decrypt the correct value', async () => {
      this.response = await this.sut('1234', encryptedData);
      assert.deepStrictEqual(this.response, true);
    });
  });
});

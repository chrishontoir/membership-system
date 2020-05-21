const assert = require('assert');

describe('transaction-api / helpers / format', () => {
  this.array = [
    {
      purchase_id: '01',
      card_id: '1234567890123456',
      description: 'Topup',
      amount: 12.45,
      date: '2020-01-01T00:00:00.000Z'
    }
  ];

  this.formatted = [
    {
      id: '01',
      description: 'TOPUP',
      date: 'Wed Jan 01 2020',
      amount: 12.45
    }
  ];

  this.sut = require('../../../../src/helpers/format');

  describe('when passed an array of transactions', () => {
    it('should format every item in the array', () => {
      this.response = this.sut(this.array);
      assert.deepStrictEqual(this.response, this.formatted);
    });
  });
});

const cardIdOne = `${Math.floor(Math.random() * 1E16)}`;
const cardIdTwo = `${Math.floor(Math.random() * 1E16)}`;
const assert = require('assert');

let token = null;

describe('REGISTRATION /REGISTER', () => {
  beforeEach(() => {
    this.request = require('supertest')('https://localhost:3000');
  });

  describe('with an unregistered card', () => {
    it('should return a REG002 - Card registered successfully response', async () =>
      await this.request
        .post('/register')
        .trustLocalhost()
        .send({
          cardId: cardIdOne,
          employeeId: '0126372638',
          firstName: 'Sally',
          lastName: 'Jones',
          email: 'sjones@testemail.com',
          mobileNo: '01234567890'
        })
        .expect(200)
        .then(response => {
          assert.deepStrictEqual(response.body.code, 'REG002');
          assert.deepStrictEqual(response.body.message, 'Card registered successfully');
        })
    );
  });

  describe('with an already registered card', () => {
    it('should return a REG003 - Card already registered response', async () =>
      await this.request
        .post('/register')
        .trustLocalhost()
        .send({
          cardId: cardIdOne,
          employeeId: '0126372638',
          firstName: 'Sally',
          lastName: 'Jones',
          email: 'sjones@testemail.com',
          mobileNo: '01234567890'
        })
        .expect(200)
        .then(response => {
          assert.deepStrictEqual(response.body.code, 'REG003');
          assert.deepStrictEqual(response.body.message, 'Card already registered');
        })
    );
  });

  describe('with invalid details', () => {
    it('should return a REG004 - Invalid data format response', async () =>
      await this.request
        .post('/register')
        .trustLocalhost()
        .send({
          cardId: cardIdOne,
          employeeId: '01263726389',
          firstName: 'Sally',
          lastName: 'Jones',
          email: 'sjones@testemail.com',
          mobileNo: '01234567890'
        })
        .expect(200)
        .then(response => {
          assert.deepStrictEqual(response.body.code, 'REG004');
          assert.deepStrictEqual(response.body.message, 'Invalid data format');
        })
    );
  });
});

describe('REGISTRATION /SECURE', () => {
  beforeEach(() => {
    this.request = require('supertest')('https://localhost:3000');
  });

  describe('with a registered card', () => {
    it('should return a SEC002 - PIN set successfully response', async () =>
      await this.request
        .post('/secure')
        .trustLocalhost()
        .send({
          cardId: cardIdOne,
          pin: 1234
        })
        .expect(200)
        .then(response => {
          assert.deepStrictEqual(response.body.code, 'SEC002');
          assert.deepStrictEqual(response.body.message, 'PIN set successfully');
        })
    );
  });

  describe('with an unregistered card', () => {
    it('should return a SEC003 - Card not registered response', async () =>
      await this.request
        .post('/secure')
        .trustLocalhost()
        .send({
          cardId: cardIdTwo,
          pin: 1234
        })
        .expect(200)
        .then(response => {
          assert.deepStrictEqual(response.body.code, 'SEC003');
          assert.deepStrictEqual(response.body.message, 'Card not registered');
        })
    );
  });
});

describe('AUTHENTICATION /AUTHENTICATE', () => {
  beforeEach(() => {
    this.request = require('supertest')('https://localhost:3001');
  });

  describe('with a valid PIN', () => {
    it('should return a AUTH002 - Authenticated response', async () =>
      await this.request
        .post('/authenticate')
        .trustLocalhost()
        .send({
          cardId: cardIdOne,
          pin: 1234
        })
        .expect(200)
        .then(response => {
          token = response.body.token;
          assert.deepStrictEqual(response.body.code, 'AUTH002');
          assert.deepStrictEqual(response.body.message, 'Authenticated');
          assert.deepStrictEqual(response.body.token !== undefined, true);
        })
    );
  });

  describe('with an invalid PIN', () => {
    it('should return a AUTH003 - Invalid PIN response', async () =>
      await this.request
        .post('/authenticate')
        .trustLocalhost()
        .send({
          cardId: cardIdOne,
          pin: 1235
        })
        .expect(200)
        .then(response => {
          assert.deepStrictEqual(response.body.code, 'AUTH003');
          assert.deepStrictEqual(response.body.message, 'Invalid PIN');
          assert.deepStrictEqual(response.body.token !== undefined, false);
        })
    );
  });

  describe('with an invalid PIN x2', () => {
    it('should return a AUTH003 - Invalid PIN response', async () =>
      await this.request
        .post('/authenticate')
        .trustLocalhost()
        .send({
          cardId: cardIdOne,
          pin: 1235
        })
        .expect(200)
        .then(response => {
          assert.deepStrictEqual(response.body.code, 'AUTH003');
          assert.deepStrictEqual(response.body.message, 'Invalid PIN');
          assert.deepStrictEqual(response.body.token !== undefined, false);
        })
    );
  });

  describe('with an invalid PIN x3', () => {
    it('should return a AUTH003 - Invalid PIN response', async () =>
      await this.request
        .post('/authenticate')
        .trustLocalhost()
        .send({
          cardId: cardIdOne,
          pin: 1235
        })
        .expect(200)
        .then(response => {
          assert.deepStrictEqual(response.body.code, 'AUTH003');
          assert.deepStrictEqual(response.body.message, 'Invalid PIN');
          assert.deepStrictEqual(response.body.token !== undefined, false);
        })
    );
  });

  describe('with an invalid PIN x4', () => {
    it('should return a AUTH004 - Account Frozen response', async () =>
      await this.request
        .post('/authenticate')
        .trustLocalhost()
        .send({
          cardId: cardIdOne,
          pin: 1235
        })
        .expect(200)
        .then(response => {
          assert.deepStrictEqual(response.body.code, 'AUTH004');
          assert.deepStrictEqual(response.body.message, 'Account Frozen');
          assert.deepStrictEqual(response.body.token !== undefined, false);
        })
    );
  });

  describe('with an card without a PIN set', () => {
    it('should return a AUTH003 - Invalid PIN response', async () =>
      await this.request
        .post('/authenticate')
        .trustLocalhost()
        .send({
          cardId: cardIdTwo,
          pin: 1235
        })
        .expect(200)
        .then(response => {
          assert.deepStrictEqual(response.body.code, 'AUTH006');
          assert.deepStrictEqual(response.body.message, 'Card has not been secured with a PIN');
          assert.deepStrictEqual(response.body.token !== undefined, false);
        })
    );
  });
});

describe('TRANSACTION /TOPUP', () => {
  beforeEach(() => {
    this.request = require('supertest')('https://localhost:3002');
  });

  describe('with a valid PIN and a valid JWT and no previous balance', () => {
    it('should return a TRAN002 - Successful Topup response', async () =>
      await this.request
        .post('/topup')
        .set('Authorization', `Bearer ${token}`)
        .trustLocalhost()
        .send({
          cardId: cardIdOne,
          descrition: 'Topup',
          amount: 5.00
        })
        .expect(200)
        .then(response => {
          assert.deepStrictEqual(response.body.code, 'TRAN002');
          assert.deepStrictEqual(response.body.message, 'Successful Topup');
          assert.deepStrictEqual(response.body.balance, '5.00');
        })
    );
  });

  describe('with a valid PIN and a valid JWT and a previous balance', () => {
    it('should return a TRAN002 - Successful Topup response', async () =>
      await this.request
        .post('/topup')
        .set('Authorization', `Bearer ${token}`)
        .trustLocalhost()
        .send({
          cardId: cardIdOne,
          descrition: 'Topup',
          amount: 6.00
        })
        .expect(200)
        .then(response => {
          assert.deepStrictEqual(response.body.code, 'TRAN002');
          assert.deepStrictEqual(response.body.message, 'Successful Topup');
          assert.deepStrictEqual(response.body.balance, '11.00');
        })
    );
  });

  describe('with a valid PIN and an invalid JWT', () => {
    it('should return a API003 - Forbidden response', async () =>
      await this.request
        .post('/topup')
        .set('Authorization', 'Bearer abcde.fghij.klmno')
        .trustLocalhost()
        .send({
          cardId: cardIdOne,
          descrition: 'Topup',
          amount: 6.00
        })
        .expect(200)
        .then(response => {
          assert.deepStrictEqual(response.body.code, 'API003');
          assert.deepStrictEqual(response.body.message, 'Forbidden');
        })
    );
  });

  describe('with a valid PIN and no JWT', () => {
    it('should return a API002 - Unauthorized response', async () =>
      await this.request
        .post('/topup')
        .trustLocalhost()
        .send({
          cardId: cardIdOne,
          descrition: 'Topup',
          amount: 6.00
        })
        .expect(200)
        .then(response => {
          assert.deepStrictEqual(response.body.code, 'API002');
          assert.deepStrictEqual(response.body.message, 'Unauthorized');
        })
    );
  });
});

describe('TRANSACTION /PURCHASE', () => {
  beforeEach(() => {
    this.request = require('supertest')('https://localhost:3002');
  });

  describe('with a valid PIN and a valid JWT and enough funds', () => {
    it('should return a TRAN012 - Successful Purchase response', async () =>
      await this.request
        .post('/purchase')
        .set('Authorization', `Bearer ${token}`)
        .trustLocalhost()
        .send({
          cardId: cardIdOne,
          descrition: 'Purchase',
          amount: 5.00
        })
        .expect(200)
        .then(response => {
          assert.deepStrictEqual(response.body.code, 'TRAN012');
          assert.deepStrictEqual(response.body.message, 'Successful Purchase');
          assert.deepStrictEqual(response.body.balance, '6.00');
        })
    );
  });

  describe('with a valid PIN and a valid JWT and not enough funds', () => {
    it('should return a TRAN014 - Not enough funds response', async () =>
      await this.request
        .post('/purchase')
        .set('Authorization', `Bearer ${token}`)
        .trustLocalhost()
        .send({
          cardId: cardIdOne,
          descrition: 'Topup',
          amount: 7.00
        })
        .expect(200)
        .then(response => {
          assert.deepStrictEqual(response.body.code, 'TRAN014');
          assert.deepStrictEqual(response.body.message, 'Not enough funds');
          assert.deepStrictEqual(response.body.balance !== undefined, false);
        })
    );
  });

  describe('with a valid PIN and an invalid JWT', () => {
    it('should return a API003 - Forbidden response', async () =>
      await this.request
        .post('/purchase')
        .set('Authorization', 'Bearer abcde.fghij.klmno')
        .trustLocalhost()
        .send({
          cardId: cardIdOne,
          descrition: 'Purchase',
          amount: 6.00
        })
        .expect(200)
        .then(response => {
          assert.deepStrictEqual(response.body.code, 'API003');
          assert.deepStrictEqual(response.body.message, 'Forbidden');
        })
    );
  });

  describe('with a valid PIN and no JWT', () => {
    it('should return a API002 - Unauthorized response', async () =>
      await this.request
        .post('/purchase')
        .trustLocalhost()
        .send({
          cardId: cardIdOne,
          descrition: 'Purchase',
          amount: 6.00
        })
        .expect(200)
        .then(response => {
          assert.deepStrictEqual(response.body.code, 'API002');
          assert.deepStrictEqual(response.body.message, 'Unauthorized');
        })
    );
  });
});

describe('TRANSACTION /HISTORY', () => {
  beforeEach(() => {
    this.request = require('supertest')('https://localhost:3002');
  });

  describe('with a valid PIN and a valid JWT and the account has a history', () => {
    it('should return a TRAN022 - Transaction history retrieved response', async () =>
      await this.request
        .post('/history')
        .set('Authorization', `Bearer ${token}`)
        .trustLocalhost()
        .send({
          cardId: cardIdOne
        })
        .expect(200)
        .then(response => {
          assert.deepStrictEqual(response.body.code, 'TRAN022');
          assert.deepStrictEqual(response.body.message, 'Transaction history retrieved');
          assert.deepStrictEqual(response.body.history !== undefined, true);
        })
    );
  });

  describe('with a valid PIN and an invalid JWT', () => {
    it('should return a API003 - Forbidden response', async () =>
      await this.request
        .post('/history')
        .set('Authorization', 'Bearer abcde.fghij.klmno')
        .trustLocalhost()
        .send({
          cardId: cardIdOne
        })
        .expect(200)
        .then(response => {
          assert.deepStrictEqual(response.body.code, 'API003');
          assert.deepStrictEqual(response.body.message, 'Forbidden');
        })
    );
  });

  describe('with a valid PIN and no JWT', () => {
    it('should return a API002 - Unauthorized response', async () =>
      await this.request
        .post('/history')
        .trustLocalhost()
        .send({
          cardId: cardIdOne
        })
        .expect(200)
        .then(response => {
          assert.deepStrictEqual(response.body.code, 'API002');
          assert.deepStrictEqual(response.body.message, 'Unauthorized');
        })
    );
  });
});

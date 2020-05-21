const apiElapsedTime = require('./src/elapsed-time');
const authorize = require('./src/authorize');
const generateJWT = require('./src/generate-jwt');
const getResponse = require('./src/get-response');
const setupDb = require('./src/setup-db');

module.exports = {
  apiElapsedTime,
  authorize,
  generateJWT,
  getResponse,
  setupDb
};

const authorize = require('./src/authorize');
const setupDb = require('./src/setup-db');
const apiElapsedTime = require('./src/elapsed-time');
const generateJWT = require('./src/generate-jwt');
const getResponse = require('./src/responses');

module.exports = {
  authorize,
  setupDb,
  apiElapsedTime,
  generateJWT,
  getResponse
};

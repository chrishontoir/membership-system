const Koa = require('koa');
const setupDb = require('../../../common/src/db-connect');
const config = require('../config');
const registration = require('./router');

const setup = () => {
  const app = new Koa();
  app.use(setupDb(config));
  registration.setup(app);
  return app;
};
module.exports = setup;

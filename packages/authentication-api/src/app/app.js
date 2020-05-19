const Koa = require('koa');
const setupDb = require('../../../common/src/db-connect');
const config = require('../config');
const routes = require('./router');

const setup = () => {
  const app = new Koa();
  app.use(setupDb(config));
  routes.setup(app);
  return app;
};
module.exports = setup;

const Koa = require('koa');
const { setupDb, apiElapsedTime } = require('../../../common');
const config = require('../config');
const routes = require('./router');

const setup = () => {
  const app = new Koa();
  app.use(setupDb(config));
  app.use(apiElapsedTime);
  routes.setup(app);
  return app;
};
module.exports = setup;

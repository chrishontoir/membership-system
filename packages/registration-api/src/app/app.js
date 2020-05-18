const Koa = require('koa');

const setup = () => {
  const app = new Koa();
  const registration = require('./router');
  registration.setup(app);
  return app;
};
module.exports = setup;

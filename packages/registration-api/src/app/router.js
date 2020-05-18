const Router = require('koa-router');
const register = require('../handlers/register');

const router = new Router();

const setup = (app) => {
  router.get('/register', register);
  app.use(router.routes());
  app.use(router.allowedMethods());
};

module.exports = {
  setup
};
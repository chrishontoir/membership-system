const Router = require('koa-router');
const bodyParser = require('koa-bodyparser')({
  enableTypes: ['json']
});
const register = require('../handlers/register');
const secure = require('../handlers/secure');

const router = new Router();

const setup = (app) => {
  router.post('/register', bodyParser, register);
  router.post('/secure', bodyParser, secure);
  app.use(router.routes());
  app.use(router.allowedMethods());
};

module.exports = {
  setup
};
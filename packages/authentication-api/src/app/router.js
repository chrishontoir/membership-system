const Router = require('koa-router');
const bodyParser = require('koa-bodyparser')({
  enableTypes: ['json']
});
const authenticate = require('../handlers/authenticate');

const router = new Router();

const setup = (app) => {
  router.post('/authenticate', bodyParser, authenticate);
  app.use(router.routes());
  app.use(router.allowedMethods());
};

module.exports = {
  setup
};
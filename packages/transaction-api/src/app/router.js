const Router = require('koa-router');
const bodyParser = require('koa-bodyparser')({
  enableTypes: ['json']
});
const authorize = require('../../../common/src/authorize');
const topup = require('../handlers/topup');
const purchase = require('../handlers/purchase');

const router = new Router();

const setup = (app) => {
  router.post('/topup', bodyParser, authorize, topup);
  router.post('/purchase', bodyParser, authorize, purchase);
  app.use(router.routes());
  app.use(router.allowedMethods());
};

module.exports = {
  setup
};

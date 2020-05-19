const pgp = require('pg-promise')();

const setupDb = (config) => async (ctx, next) => {
  ctx.db = ctx.db ? ctx.db : pgp(config.db);
  await next();
}

module.exports = setupDb;

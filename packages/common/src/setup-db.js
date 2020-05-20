const pgp = require('pg-promise')();

const setupDb = (config) => async (ctx, next) => {
  ctx.db = ctx.db ? ctx.db : pgp(config.db);

  ctx.res.on('finish', () => {
    return ctx.db.$pool.end;
  });

  await next();
};

module.exports = setupDb;

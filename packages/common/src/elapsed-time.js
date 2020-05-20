const moment = require('moment');

const apiElapsedTime = async (ctx, next) => {
  const start = moment();

  const onResponse = () => {
    const end = moment();
    const elapsed = end.diff(start);

    console.log({
      code: 'API001',
      message: 'API Elapsed Time',
      start: start.toISOString(),
      end: end.toISOString(),
      elapsed: `${elapsed}ms`
    });
  };

  ctx.res.on('finish', onResponse);

  await next();
};

module.exports = apiElapsedTime;

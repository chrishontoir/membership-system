const env = process.env;

const defaults = {
  port: 3000
};

const getConfig = () => {
  console.log(`env.NODE_ENV: ${env.NODE_ENV}`);
  if (!env.NODE_ENV || ['test', 'dev'].includes(env.NODE_ENV)) {
    console.log('CONFIG: Defaults');
    return defaults;
  }
  return require('./config.json');
};

module.exports = getConfig;

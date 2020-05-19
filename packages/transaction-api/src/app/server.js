const https = require('https');
const app = require('./app')();
const config = require('../config');
const fs = require('fs');
const path = require('path');

const server = https.createServer({
  key: fs.readFileSync(path.resolve(__dirname, config.tls.key)),
  cert: fs.readFileSync(path.resolve(__dirname, config.tls.cert))
}, app.callback());

module.exports = server.listen(config.port, err => {
  if (err) return console.error('Failed to start server', err);
  console.log(`Server started on  https://localhost:${config.port}`);
});

const http = require('http');
const app = require('./app')();
const server = http.createServer(app.callback());
const config = require('../config');

module.exports = server.listen(config.port, err => {
  if (err) return console.error('Failed to start server', err);
  console.log(`Server started on  http://localhost:${config.port}`);
});
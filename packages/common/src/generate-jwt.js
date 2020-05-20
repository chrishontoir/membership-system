const jose = require('node-jose');
const fs = require('fs');
const path = require('path');

const generateJWT = async cardId => {
  const pem = fs.readFileSync(path.resolve(__dirname, '../../../certificates/memstem-key.pem'));

  const key = await jose.JWK.asKey(pem, 'pem');

  const payload = JSON.stringify({
    cardId: cardId,
    timestamp: new Date().toISOString()
  });

  const token = await jose.JWS.createSign({ alg: 'RS256', format: 'compact' }, key).update(payload, 'utf8').final();

  return token;
};

module.exports = generateJWT;

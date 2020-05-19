const bcrypt = require('bcrypt');
const saltRounds = 10;

const encrypt = async data => {
  return bcrypt.hashSync(data, saltRounds);
};

module.exports = encrypt;

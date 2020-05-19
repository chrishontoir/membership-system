const bcrypt = require('bcrypt');

const checkEncryption = async (data, hash) => {
  return bcrypt.compareSync(data, hash)
};

module.exports = checkEncryption;
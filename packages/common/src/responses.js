const responses = {
  'API001': 'API Elapsed Time',
  'REG002': 'Card registered successfully',
  'REG003': 'Card already registered',
  'REG004': 'Invalid data format',
  'REG005': 'Application Error',
  'AUTH002': 'PIN set successfully',
  'AUTH004': 'Invalid data format',
  'AUTH005': 'Application Error'
}

const getResponse = code => {
  const matchingResponse = responses[code];
  return {
    code,
    message: matchingResponse,
    timestamp: new Date().toISOString()
  };
};

module.exports = getResponse;

const responses = {
  'API001': 'API Elapsed Time',
  'REG002': 'Card registered successfully',
  'REG003': 'Card already registered',
  'REG004': 'Invalid data format',
  'REG005': 'Application Error',
  'SEC002': 'PIN set successfully',
  'SEC003': 'Card not registered',
  'SEC004': 'Invalid data format',
  'SEC005': 'Application Error',
  'AUTH002': 'Authenticated',
  'AUTH003': 'Invalid PIN',
  'AUTH004': 'Account Frozen'
}

const getResponse = (code, logParams) => {
  const matchingResponse = responses[code];
  const response = {
    code,
    message: matchingResponse,
    timestamp: new Date().toISOString()
  };
  console.log({ ...response, ...logParams });
  return response;
};

module.exports = getResponse;

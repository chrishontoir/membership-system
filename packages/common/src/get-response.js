const responses = {
  API001: 'API Elapsed Time',
  API002: 'Unauthorized',
  API003: 'Forbidden',
  API004: 'Session Expired',
  REG002: 'Card registered successfully',
  REG003: 'Card already registered',
  REG004: 'Invalid data format',
  REG005: 'Application Error',
  SEC002: 'PIN set successfully',
  SEC003: 'Card not registered',
  SEC004: 'Invalid data format',
  SEC005: 'Application Error',
  AUTH002: 'Authenticated',
  AUTH003: 'Invalid PIN',
  AUTH004: 'Account Frozen',
  AUTH005: 'Application Error',
  AUTH006: 'Card has not been secured with a PIN',
  TRAN002: 'Successful Topup',
  TRAN003: 'Card not registered',
  TRAN005: 'Application Error',
  TRAN012: 'Successful Purchase',
  TRAN013: 'Card not registered',
  TRAN014: 'Not enough funds',
  TRAN015: 'Application Error',
  TRAN022: 'Transaction history retrieved',
  TRAN023: 'No transactions found',
  TRAN025: 'Application Error'
};

const getResponse = (code, outputParams) => {
  console.log('QUESTION', code)
  const matchingResponse = responses[code];
  const response = {
    code,
    message: matchingResponse,
    timestamp: new Date().toISOString()
  };
  console.log({ ...response, ...outputParams });
  return { ...response, ...outputParams };
};

module.exports = getResponse;

# Transaction API
A microservice API for managing user transaction requests.

## Start
Make sure that you're in the root directory of the monorepo.

- Install packages if you already haven't.
  ```
  yarn
  ```

- Start the service locally.
  ```
  yarn start:transaction-api
  ```

- Start the service locally in watch mode so that code changes restart the server.
  ```
  yarn dev:transaction-api
  ```

- Start the service in a docker container
  ```
  yarn docker:transaction-api
  ```

- Start the service in a docker container with ports exposed to localhost and in watch mode so that code changes restart the server (ideal for development).
  ```
  yarn docker-dev:transaction-api
  ```

  ### Database 
  If you start the service using one of the docker commands, then the database service will also start up. If you need to start up the database service independently, run
  ```
  yarn database
  ```

## Test
- Run unit tests
  ```
  yarn test-unit:transaction-api
  ```

- Run integration tests
  ```
  yarn test-integration:transaction-api
  ```

- Run code coverage check
  ```
  yarn test-coverage:transaction-api
  ```

---
---

## Requests

### 1. Topup
Add funds to an account

- URL
  ```
  POST https://localhost:3002/topup
  ```
- Header - `Authorization: Bearer JWT`
  ```
  {
    "cardId": Must match cardId in the request body,
    "timestamp": Must be within the last 10 minutes
  }
  ```
- Body (JSON)
  ```
  {
    "cardId": "1234567890123456",
    "description": "Topup",
    "amount": 10
  }
  ```

---

### 2. Purchase
Remove funds from an account and add to payment history

- URL
  ```
  POST https://localhost:3002/purchase
  ```
- Header - `Authorization: Bearer JWT`
  ```
  {
    "cardId": Must match cardId in the request body,
    "timestamp": Must be within the last 10 minutes
  }
  ```
- Body (JSON)
  ```
  {
    "cardId": "1234567890123456",
    "description": "Purchase",
    "amount": 5
  }
  ```

---

### 3. History
Retrieve history of all transactions on an account

- URL
  ```
  POST https://localhost:3002/history
  ```
- Header - `Authorization: Bearer JWT`
  ```
  {
    "cardId": Must match cardId in the request body,
    "timestamp": Must be within the last 10 minutes
  }
  ```
- Body (JSON)
  ```
  {
    "cardId": "1234567890123456"
  }
  ```

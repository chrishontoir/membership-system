# Registration API
A microservice API for managing user registration requests.

## Start
Make sure that you're in the root directory of the monorepo.

- Install packages if you already haven't.
  ```
  yarn
  ```

- Install certificates if you haven't already.
  ```
  yarn generate
  ```

- Start the service locally.
  ```
  yarn start:registration-api
  ```

- Start the service locally in watch mode so that code changes restart the server.
  ```
  yarn dev:registration-api
  ```

- Start the service in a docker container
  ```
  yarn docker:registration-api
  ```

- Start the service in a docker container with ports exposed to localhost and in watch mode so that code changes restart the server (ideal for development).
  ```
  yarn docker-dev:registration-api
  ```

  ### Database 
  If you start the service using one of the docker commands, then the database service will also start up. If you need to start up the database service independently, run
  ```
  yarn database
  ```

## Test
- Run unit tests
  ```
  yarn test-unit:registration-api
  ```

- Run integration tests
  ```
  yarn test-integration:registration-api
  ```

- Run code coverage check
  ```
  yarn test-coverage:registration-api
  ```

---
---

## Requests

### 1. Register
Register a new user

- URL
  ```
  POST https://localhost:3000/register
  ```
- Body (JSON)
  ```
  {
    "cardId": "1234567890123456",
    "employeeId": "0123456789",
    "firstName": "Jim",
    "lastName": "Brown",
    "email": "jbrown@testemail.com",
    "mobileNo": "01234567890"
  }
  ```
---
### 2. Secure
Set a PIN for the user

- URL
  ```
  POST https://localhost:3000/secure
  ```
- Body (JSON)
  ```
  {
    "cardId": "1234567890123456",
    "pin": 1234
  }
  ```
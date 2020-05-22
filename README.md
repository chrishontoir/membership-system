# MemStem
A membership system for registering and authenticating users to access an online purchasing service. This repository is structured as a monorepo, and contains three API microservices and a database. For more information, visit each of the service's individual README files.

---
---

## Registration API
- [README](./packages/registration-api/README.md)
- [Swagger](./packages/registration-api/swagger.yml)

---

## Authentication API
- [README](./packages/authentication-api/README.md)
- [Swagger](./packages/authentication-api/swagger.yml)

---

## Transaction API
- [README](./packages/transaction-api/README.md)
- [Swagger](./packages/transaction-api/swagger.yml)

---
---

## Quick Start
Install all packages using `yarn`. `Yarn` is used over `npm` to make use of `yarn workspaces`.
```
yarn
```

Generate certificates
```
yarn generate
```

Start up the microservices. Each of these commands also starts up the `database` service if it isn't already running.
```
yarn docker-dev:registration-api
yarn docker-dev:authentication-api
yarn docker-dev:transaction-api
```
*Using `docker-dev` instead of `docker` exposes the ports to localhost.

---
---

## Integration Tests
Start all of the services with their ports exposed to localhost
```
yarn docker-dev:registration-api
yarn docker-dev:authentication-api
yarn docker-dev:transaction-api
```
Run the script which executes the suite of integration tests
```
yarn test-integration
```
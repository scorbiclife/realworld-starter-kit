# ![RealWorld Example App](logo.png)

> ### node + express + mysql codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.

### [Demo](https://demo.realworld.io/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

This codebase was created to demonstrate a fully fledged fullstack application built with node, express, and mysql including CRUD operations, authentication, routing, pagination, and more.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

# How it works

Three layers: repository, service, and controller

- Repository

  - contains reusable modules that operate on a database

- Service

  - contains self-contained operations that each run one or more transactions

- Controller
  - contains operations happening in a single http request/response cycle

## Design decisions

- Used bcrypt for hashing passwords

- Settling the interface of services and repositories
  - Explanation
    - A repository takes in a connection handle when we call a method,
      while a service takes in a connection pool when initialized
      and manages its own connection when a method is called.
  - Why we didn't take in a connection handle as a parameter for services
    - In-memory implementations of services didn't need connection parameters,
      hinting that this is not required in the interface of the service.
  - **Tradeoffs**
    - When services take care of their own database connections,
      it becomes harder/impossible to wrap tests in a single transaction.
      - After estimating the complexity of forcing the service to use a predetermined connection,
        we decided to run the service in its own transaction and clean up in tests manually.
        - This is partly because this is a one-man project and I control all code and tests.

# Getting started

## Local

### Requirements

- POSIX shell
- node 20 (for `--env-file` option for testing)

### Setup

```sh
npm install
cp .env.example.env .env
"$EDITOR" .env
```

### Run

```sh
npm run env start
```

### Database migration

```sh
# `migrate:up` and `migrate:down` are also valid commands
npm run env migrate:latest
```

### Test

```sh
# Some tests require access to AWS KMS
aws sso login --profile $YOUR_AWS_SSO_PROFILE # or other login method
npm test
```

## Docker

### Build

```sh
docker build -t "$YOUR_IMAGE_NAME" .
```

### Run

```sh
docker run \
  --name "$YOUR_CONTAINER_NAME" \
  -p 3000:3000 \
  --env-file .env \
  -v ~/.aws:/root/.aws \
  -- "$YOUR_IMAGE_NAME"
```
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Setup
  1. cp .env.example .env
  2. fill ormconfig.js and ormconfig.json

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# run migrations
$ npm run typeorm migration:

# run migrations
$ npm run seed
```


## Endpoints
  0. /register (email, password)
  1. /login  returns refresh refresh token
  2. /authenticate (bearer refresh token) returns users details with refresh token
  3. /startGame (amount, bearer refresh token) returns game stage info with refresh token
  4. /endGame (prediction, bearer refresh token) returns game info

```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

  Nest is [MIT licensed](LICENSE).

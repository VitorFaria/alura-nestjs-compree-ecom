<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

This project is an example of an API REST made with nestJS framework to simulate some functionalities of an ecommerce workflow.
Some of the functionalities available in this mini application:
- Users management
- Authentication
- Product Management
- Order management
- Error handling
- Logging 

To install and run this project, you must have a preset of these stack on your environment:
- node installed
- docker installed and set

## Setting .env variables

When you clone this repository, you'll see a .env.example file in the root folder. You should duplicate the .env.example file, 
name it .env and put the credentials you wish to access the postgres database
To set up SALT_PASSWORD & JWT_SECRET inside your .env file, there are a few ways you can do it. Here's a quick way that i used for my app configuration.
SALT_PASSWORD GENERATE: On your console you should type <b>node</b>, to enter inside node console. After that, add the following lines:
```bash
$ const bcrypt = require('bcrypt')
$ bcrypt.genSaltSync(10)
```
Copy the hash generated and replace it in the SALT_PASSWORD variable

JWT_SECRET GENERATE: Still with node console opened, add the following line:
```bash
$ require('crypto').randomBytes(64).toString('hex')
```
Copy the hash generated and replace it in the JWT_SECRET variable

## Installation

```bash
$ npm install
```

## Running the container

``` bash
$ docker compose up
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

$ When you run the app, you probably going to see an error. This is because the database was not automatically created when
$ you started the app. To fix that, you should follow these instructions to solve it
$ Go to your browser and access the postgres admin, on localhost:8081 and login with the .env credentials
$ Once you are logged in, click on "Add New Server". It will open an modal 
$ On the General tab, insert the name of your server in the "Name" field
$ On the Connection tab, on "Host name/address", put "postgres"
$ On "Username" and "Password" fields, put the credentials from your .env file. Click on save
$ After that, on the top left of your postgres admin page, it will show the server created
$ Right click on "Databases" to create a new database. It will open another modal and you should put the name the database set on .env file. Save it and your application error should stop. 

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Running TypeORM migrations

```bash
$ npm run typeorm migration:run
```

## Create TypeORM migration

```bash
$ npm run typeorm migration:generate src/db/migrations/your-migration-name
```

## License

Nest is [MIT licensed](LICENSE).

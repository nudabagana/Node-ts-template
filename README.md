# Node Typescript template
Nodejs, typescript, eslint, typeORM, typescript-rest, typescript-rest-swagger, auth boilerplate code

## Getting started

NOTE: microservice requires node.js, postgreSQL.

To start project run:
make sure posgres is running (posgres docker-compose container is included)
```shell
git clone ...
cd ...
copy and fill .env
yarn install
yarn gen:migrations initMig
yarn db:migrate
yarn swagger
yarn start
```

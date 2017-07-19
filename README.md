# Nodejs PostgreSQL Authentication API Server

This is an Authentication API server using Node.js and PostgreSQL for data storage. It uses Redis & JWT for session management.

## Requirements
Docker

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## Installation

`make build-dev`

## Usage

`make up-dev`


- Run database migrations & seeds:

`npm run faker`

`npm run migrate`

`npm run seed`

- Access Swagger-UI
[http://localhost:8080](http://localhost:8080)

## Maintainers

[sgraham785](https://github.com/sgraham785)

## Contributing

1. Create your feature branch: `git checkout -b my-new-feature`
2. Commit your changes: `git commit -am 'Add some feature'`
3. Push to the branch: `git push origin my-new-feature`
4. Submit a pull/merge request to a maintainer :D

## Roadmap
in no particular order

- [x] Decalative routes
- [x] Public vs. Private(auth) routes
- [x] Migrations & Seeds
- [x] Add security best practices
- [x] Password encryption
- [x] Use JWT for private route auth
- [x] Create Postman collection
- [x] Verification emailer
- [x] Use faker for seeding
- [x] Utilize swagger documentation
- [x] Dockerize
- [x] SSL
- [x] Health check
- [ ] Add tests

## Known Issues
* https://github.com/sgraham785/node-postgres-api-server/issues

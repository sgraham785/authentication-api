# Nodejs PostgreSQL API Server

This is a boilerplate API server using Node.js and PostgreSQL.  It has a TODO example and user auth (which needs some work to finish up)

## Requirements
Node.js (duh) 6.5.x +

PostrgreSQL 9.4+

Nodemon

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## Installation

`npm -g install nodemon`

`npm install`

## Configuration

Rename `.env.sample` to `.env` and add your configuration credentials

## Usage

Run database migrations & seeds:

`node source/middleware/database/migrate.js `

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/f8493f5b75ab1b296b22)

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
- [x] Use JSON API specification
- [ ] ~~Implement password encryption~~
- [x] Use JWT for private route auth
- [x] Create Postman collection
- [x] Add mailer
- [x] Use faker for seeding
- [x] Utilize swagger documentation
- [ ] Dockerize
- [x] Implement SSL
- [ ] Add health checks
- [ ] Add tests

## Known Issues
* Problem with related link in return https://github.com/endpoints/endpoints-example/issues/27

* https://github.com/sgraham785/node-postgres-api-server/issues

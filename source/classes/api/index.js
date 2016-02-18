var path = require('path');

var express = require('express');
var routeBuilder = require('express-routebuilder');

var Endpoints = require('endpoints');

module.exports = new Endpoints.Application({
  searchPaths: [path.join(__dirname, '../..', 'modules')],
  routeBuilder: function (routes, prefix) {
    return routeBuilder(express.Router(), routes, prefix);
  },
  Controller: Endpoints.Controller.extend({
    baseUrl: '/v1',
    store: Endpoints.Store.bookshelf,
    format: Endpoints.Format.jsonapi,
    validators: [Endpoints.ValidateJsonSchema]
  })
});

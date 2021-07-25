'use strict';

var _debug = require('debug');
var Hapi = require('hapi');
var Inert = require('inert');
var util = require('util');
var xml2json = require('xml2json');

var meta = require('./package.json');
var debug = _debug(util.format('%s:http', meta.name));

var server = new Hapi.Server({
  connections: {
    routes: {
      cors: true,
      payload: {
        maxBytes: 5e+7,
        timeout: 100000
      }
    }
  },
  debug: process.env.MACROCOSM_DEBUG ? {
    log: [ 'error' ],
    request: [ 'error', 'received', 'response' ]
  } : false
});


server.connection({ port: process.env.PORT || 4000 });


server.ext('onRequest', function(req, res) {
  debug('%s %s', req.method.toUpperCase(), req.url.href);
  return res.continue();
});

// Register routes
server.register(Inert, () => {});

server.register({
  register: require('hapi-router'),
  options: {
    routes: 'routes/*.js'
  }
}, function (err) {
  if (err) throw err;
});

server.ext('onPostAuth', function(req, res) {

  if (req.mime === 'text/xml' && req.payload.length > 0) {
    debug(req.payload);
    req.payload = xml2json.toJson(req.payload, {
      object: true
    });
  }

  return res.continue();
});

server.ext('onPreResponse', function (request, reply) {
  // Add the `data` from a Boom object to the response
  if (!request.response.isBoom) {
    return reply.continue();
  }
  if (request.response.data) {
    request.response.output.payload.data = request.response.data;
  }
  return reply(request.response);
});

server.start(function () {
  console.log('Server running at:', server.info.uri);
});

module.exports = server;

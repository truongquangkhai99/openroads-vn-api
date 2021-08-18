'use strict';

var assert = require('assert');

var environment = process.env.MACROCOSM_ENV || "development";
var connection = process.env.DATABASE_URL || require('./config/development').connection[environment];

assert.ok(connection, 'Connection is undefined; check DATABASE_URL or local.js');

var knex = require('knex')({
  client: 'pg',
  connection: connection,
  debug: false,
  pool: {
    min: 2,
    max: 10
  }
});

module.exports = knex;
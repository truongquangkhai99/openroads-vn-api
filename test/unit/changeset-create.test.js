'use strict';
var knex = require('connection.js');
var server = require('../bootstrap.test');
var Changeset = require('./helpers/create-changeset');

describe('changeset create endpoint', function () {
  it('saves bounding box and returns a numerical changeset id.', function (done) {
    var payload = {
      method: 'PUT',
      url: '/changeset/create',
      payload: {
        osm: {
          uid: 99,
          user: 'openroads',
          changeset: new Changeset().getAttrs()
        }
      }
    };

    server.inject(payload).then(function (res) {
      res.statusCode.should.eql(200);
      var id = +res.payload;
      (id).should.be.within(0, Number.MAX_VALUE);
      done();
    }).catch(done);
  });
});

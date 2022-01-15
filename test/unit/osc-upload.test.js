'use strict';
var fs = require('fs');
var server = require('../bootstrap.test');
var serverTest = require('./helpers/server-test');

var testChangeset = new serverTest.testChangeset();

var serverShouldStatus = function (mock, done, status) {
  var options = {
    method: 'POST',
    url: '/upload/' + testChangeset.changesetId,
    payload: mock
  };
  server.inject(options)
    .then(function (res) {
      res.statusCode.should.eql(status);
      return done();
    }).catch(done);
};

describe('OScUploadController', function () {
  describe('#upload', function () {
    after(function (done) {
      testChangeset.remove()
        .then(() => done())
        .catch(done);
    });

    before('Create changeset', function (done) {
      testChangeset.create()
        .then(() => done())
        .catch(done);
    });

    var data = fs.readFileSync(require.resolve('./fixtures/osc-malvar-road.xml'));
    it('Should ok when uploading a valid file', function (done) {
      serverShouldStatus(data, done, 200);
    });

    it('Should break when uploading a malformed file', function (done) {
      data[0] = 0;
      serverShouldStatus(data, done, 400);
    });
  });
});

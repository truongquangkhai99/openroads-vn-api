'use strict';
var _ = require('lodash');

function toArray(val) {
  if (_.isArray(val)) {
    return val;
  }
  return [val];
}

function parse(entities) {
  return toArray(entities).map(entity => {
    if (entity.get) { return entity.get(); }
    else return entity
  })
}

var newChange = function (obj) {
  var change = {
    create: {},
    modify: {},
    delete: {}
  };

  this.change = change;
  return this;
}

newChange.prototype.create = function (type, entities) {
  entities = parse(entities);
  var x = this.change.create[type];
  this.change.create[type] = (x && x.length) ? x.concat(entities) : entities;
  return this;
}

newChange.prototype.modify = function (type, entities) {
  entities = parse(entities);
  var x = this.change.modify[type];
  this.change.modify[type] = (x && x.length) ? x.concat(entities) : entities;
  return this;
}

newChange.prototype.delete = function (type, entities) {
  entities = parse(entities);
  var x = this.change.delete[type];
  this.change.delete[type] = (x && x.length) ? x.concat(entities) : entities;
  return this;
}

newChange.prototype.get = function () {
  return this.change;
}

newChange.prototype.wipe = function () {
  this.change = {
    create: {},
    modify: {},
    delete: {}
  };
}

newChange.prototype.getAttrs = function (attr) {
  return _.extend({}, {
    id: 1,
    created_at: new Date(),
    closed_at: new Date(),
    min_lat: 1,
    max_lat: 1,
    min_lon: 1,
    max_lon: 1,
    num_changes: 0,
    user: 'test',
    uid: 1,
    tag: []
  }, attr);
};

module.exports = newChange;

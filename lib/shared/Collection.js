"use strict";
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;

class Collection extends EventEmitter {
  constructor () {
    super();
    this.indexedItems = {};
  }

  add (id, item) {
    this.indexedItems[id] = item;

    this.emit('created', id, item);
  }

  update (id, item) {
    this.indexedItems[id] = item;

    this.emit('updated', id, item);
  }

  remove (id) {
    var item = this.indexedItems[id];
    this.indexedItems[id] = null;

    this.emit('deleted', id, item);
  }

  item (id) { return this.indexedItems[id]; }

  indexed () { return this.indexedItems; }

  all () { return _.values(this.indexedItems); }
}

module.exports = Collection;

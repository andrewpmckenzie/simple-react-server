"use strict";

var _ = require('lodash');

class CollectionWiring {
  constructor (options) {
    this.collections = options.collections;
    this.latestId = 0;
  }

  run () {
    this.addNewClock();
    this.updateClocks();
  }

  addNewClock () {
    var id = this.latestId++;
    this.collections.clock.add(id, { id: id, updates: 0, time: Date.now() });
    console.log('Added clock %s.', id);
    setTimeout(this.addNewClock.bind(this), 5 * 1000);
  }

  updateClocks () {
    var time = Date.now();
    _.each(this.collections.clock.indexed(), (clock, id) => {
      this.collections.clock.update(id, { id: clock.id, updates: clock.updates + 1, time: time })
    });
    setTimeout(this.updateClocks.bind(this), 1 * 1000);
  }
}

module.exports = CollectionWiring;

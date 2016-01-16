"use strict";

var _ = require('lodash');

class App {
  constructor (options) {
    this.collections = options.collections;
    this.rpcs = options.rpcs;

    this.currentId = 0;
  }

  run () {
    this.rpcs.addMessage.invoke(this.addMessage.bind(this));
  }

  addMessage (message) {
    var id = this.currentId++;
    this.collections.messages.add(id, _.extend(message, { id: id }));
  }

}

module.exports = App;

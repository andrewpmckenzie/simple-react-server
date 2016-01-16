"use strict";

var CollectionManager = require('../shared/CollectionManager').Client;
var React = require('react');
var ReactDOM = require('react-dom');
var RPCManager = require('../shared/RPCManager').Client;

class App {
  constructor (options) {
    var collections = options.collections;
    var rpcs = options.rpcs;
    var socket = window.io();

    this.collectionManager = new CollectionManager({
      collections: collections,
      socket: socket
    });

    this.rpcManager = new RPCManager({
      rpcs: rpcs,
      socket: socket
    });
  }

  render (reactClass, options) {
    return ReactDOM.render(React.createElement(reactClass, options), document.getElementById('app'));
  }
}

module.exports = App;

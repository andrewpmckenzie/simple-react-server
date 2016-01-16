"use strict";

var _ = require('lodash');

class RPCManagerServer {
  constructor (options) {
    this.rpcs = options.rpcs;
    this.connections = {};
  }

  addConnection (id, socket) {
    this.connections[id] = socket;
    _.each(this.rpcs, (rpc, action) => {
      socket.on('rpc.' + action, (payload) => rpc(payload));
    });
  }

  removeConnection (id) { this.connections[id] = null; }
}

class RPCManagerClient {
  constructor (options) {
    this.rpcs = options.rpcs;
    this.socket = options.socket;

    this.setup();
  }

  setup () {
    _.each(this.rpcs, (rpc, action) => {
      rpc.invoke((payload) => this.socket.emit('rpc.' + action, payload));
    });
  }
}

module.exports = {
  Server: RPCManagerServer,
  Client: RPCManagerClient
};

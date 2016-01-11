"use strict";

var _ = require('lodash');

class CollectionSyncerServer {
  constructor (options) {
    this.collections = options.collections;
    this.connections = {};

    this.setup()
  }

  setup () {
    _.each(this.collections, (collection, collectionId) => {
      collection.on('created', (itemId, item) => this.send(collectionId, 'created', itemId, item));
      collection.on('updated', (itemId, item) => this.send(collectionId, 'updated', itemId, item));
      collection.on('deleted', (itemId, item) => this.send(collectionId, 'deleted', itemId, item));
    });
  }

  send (collectionId, action, itemId, item) {
    _.chain(this.connections).values().compact().each((connection) =>
      connection.emit('collection.' + action, collectionId, itemId, item)
    ).value();
  }

  sendAll (connection) {
    _.each(this.collections, (collection, collectionId) =>
      connection.send('collection.init', collectionId, collection.indexed())
    );
  }

  addConnection (id, socket) {
    console.log('Adding connection %s.', id);
    this.connections[id] = socket;
    this.sendAll(socket);
  }

  removeConnection (id) {
    console.log('Removing connection %s.', id);
    this.connections[id] = null;
  }
}

class CollectionSyncerClient {
  constructor (options) {
    this.collections = options.collections;
    this.socket = options.socket;

    this.setup();
  }

  setup () {
    this.socket.on('collection.created', (collectionId, itemId, item) => this.collections[collectionId].add(itemId, item));
    this.socket.on('collection.updated', (collectionId, itemId, item) => this.collections[collectionId].update(itemId, item));
    this.socket.on('collection.removed', (collectionId, itemId, item) => this.collections[collectionId].remove(itemId, item));
    this.socket.on('collection.init', (collectionId, itemMap) =>
      _.each(itemMap, (item, itemId) => this.collections[collectionId].add(itemId, item))
    );
  }
}

module.exports = {
  Server: CollectionSyncerServer,
  Client: CollectionSyncerClient
};

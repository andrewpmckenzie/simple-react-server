var collections = require('../shared/collections');
var CollectionSyncer = require('../shared/CollectionSyncer').Server;
var CollectionUpdater = require('./CollectionUpdater');
var Server = require('./Server');

module.exports = function () {

  var collectionSyncer = new CollectionSyncer({
    collections: collections
  });

  var collectionWiring = new CollectionUpdater({
    collections: collections
  });
  collectionWiring.run();

  var app = new Server({
    collectionSyncer: collectionSyncer
  });
  app.run();

  return app;
};

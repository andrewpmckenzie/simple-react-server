var App = require('./server/App');
var collections = require('./shared/collections');
var path = require('path');
var rpcs = require('./shared/rpcs');
var Server = require('..').Server;

var CLIENT_ROOT = path.join(__dirname, 'client');

var server = new Server({
  collections:   collections,
  rpcs:          rpcs,
  staticRoot:    path.join(CLIENT_ROOT, 'public'),
  lessRoot:      path.join(CLIENT_ROOT, 'public/less'),
  clientAppPath: path.join(CLIENT_ROOT, 'app.js')
});
server.run();

var app = new App({
  collections: collections,
  rpcs: rpcs
});
app.run();

module.exports = {
  server: server,
  app: app
};

"use strict";

var babelify = require('express-babelify-middleware');
var CollectionManager = require('../shared/CollectionManager').Server;
var express = require('express');
var fs = require('fs');
var http = require('http');
var less = require('express-less');
var RPCManager = require('../shared/RPCManager').Server;
var path = require('path');
var socketIo = require('socket.io');

var INDEX_PATH = path.join(__dirname, '../..');
var FALLBACK_STATIC_ROOT = path.join(__dirname, '../client/public');

class Server {
  constructor (options) {
    var collections = options.collections || {};
    var rpcs = options.rpcs || {};

    this.lessRoot = options.lessRoot;
    this.staticRoot = options.staticRoot;
    this.clientAppPath = options.clientAppPath;
    this.babelIncludes = options.babelIncludes || [];

    this.app = express();
    this.server = http.Server(this.app);
    this.io = socketIo(this.server);

    this.setupRoutes();
    this.setupIo();
    this.collectionManager = this.createCollectionManager(collections);
    this.rpcManager = this.createRPCManager(rpcs);
  }

  run () {
    this.runServer();
  }

  runServer () {
    this.server.listen(3000, function () { console.log('Listening on port 3000.'); });
  }

  createCollectionManager (collections) {
    return new CollectionManager({
      collections: collections
    });
  }

  createRPCManager (rpcs) {
    return new RPCManager({
      rpcs: rpcs
    });
  }

  setupRoutes () {
    this.setupLessRoute();
    this.setupBabelRoute();
    this.setupStaticRoute();
  }

  setupLessRoute () {
    this.app.use('/css/',   less(this.lessRoot));
  }

  setupBabelRoute () {
    var jsEntryPoint = {};
    jsEntryPoint[this.clientAppPath] = { run: true };
    var simpleReactServer = {};
    simpleReactServer[INDEX_PATH] = { expose: 'simple-react-server' };

    var serverDir = __dirname;
    var ignore = fs.readdirSync(serverDir).map((fileName) => path.join(serverDir, fileName));
    var babelIncludes = this.babelIncludes.concat(['react', 'react-dom', 'jquery', 'lodash', simpleReactServer, jsEntryPoint]);

    this.app.use('/app.js', babelify(babelIncludes, { ignore: ignore }));
  }

  setupStaticRoute () {
    this.app.use('/',       express.static(this.staticRoot));
    this.app.use('/',       express.static(FALLBACK_STATIC_ROOT));
  }

  setupIo () {
    this.io.on('connection', (socket) => {
      var id = Server.uniqueId();

      this.collectionManager.addConnection(id, socket);
      this.rpcManager.addConnection(id, socket);

      socket.on('disconnect', () => {
        this.collectionManager.removeConnection(id);
        this.rpcManager.removeConnection(id);
      });
    });
  }

  static uniqueId () { return Date.now() + ( (Math.random() * 100) | 0 ); }
}

module.exports = Server;

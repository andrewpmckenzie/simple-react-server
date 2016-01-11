"use strict";

var babelify = require('express-babelify-middleware');
var express = require('express');
var http = require('http');
var less = require('express-less');
var path = require('path');
var socketIo = require('socket.io');

var ROOT = path.join(__dirname, '../..');
var LIB_ROOT = path.join(ROOT, 'lib');

var CLIENT_ROOT = path.join(LIB_ROOT, 'client');
var CLIENT_STATIC_ROOT = path.join(CLIENT_ROOT, 'public');
var CLIENT_LESS_ROOT = path.join(CLIENT_STATIC_ROOT, 'less');
var CLIENT_JS_ENTRY = path.join(CLIENT_ROOT, 'app.js');

class Server {
  constructor (options) {
    this.app = express();
    this.server = http.Server(this.app);
    this.io = socketIo(this.server);
    this.setupRoutes();
    this.setupIo();
    this.collectionSyncer = options.collectionSyncer;
  }

  run () {
    this.runServer();
  }

  runServer () {
    this.server.listen(3000, function () { console.log('Listening on port 3000.'); });
  }

  setupRoutes () {
    var jsEntryPoint = {};
    jsEntryPoint[CLIENT_JS_ENTRY] = { run: true };

    this.app.use('/css/',   less(CLIENT_LESS_ROOT));
    this.app.use('/app.js', babelify(['react', 'react-dom', 'jquery', 'lodash', jsEntryPoint]));
    this.app.use('/',       express.static(CLIENT_STATIC_ROOT));
  }

  setupIo () {
    this.io.on('connection', (socket) => {
      var id = Server.uniqueId();

      this.collectionSyncer.addConnection(id, socket);
      socket.on('disconnect', () => this.collectionSyncer.removeConnection(id))
    });
  }

  static uniqueId () { return Date.now() + ( (Math.random() * 100) | 0 ); }
}

module.exports = Server;

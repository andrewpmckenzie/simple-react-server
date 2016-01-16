"use strict";

var _ = require('lodash');
var AppView = require('./views/app.jsx');
var ClientBase = require('simple-react-server').Client;
var collections = require('../shared/collections');
var rpcs = require('../shared/rpcs');

class ClientApp extends ClientBase {
  constructor () {
    super({
      collections: collections,
      rpcs:        rpcs
    });
    this.appEl = this.render(AppView);
  }
}

window.app = new ClientApp();

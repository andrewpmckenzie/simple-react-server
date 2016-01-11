"use strict";

var AppView = require('./views/app.jsx');
var collections = require('../shared/collections');
var CollectionSyncer = require('../shared/CollectionSyncer').Client;
var React = require('react');
var ReactDOM = require('react-dom');

class App {
  constructor (options) {
    var socket = options.socket;

    this.collectionSyncer = new CollectionSyncer({
      collections: collections,
      socket: socket
    });

    this.appEl = ReactDOM.render(React.createElement(AppView, { collections: collections }), document.getElementById('app'));
  }
}

window.App = App;

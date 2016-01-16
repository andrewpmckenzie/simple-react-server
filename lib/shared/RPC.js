"use strict";
var _ = require('lodash');

module.exports = function () {
  var handlers = [];

  var RPC = (payload) => {
    _.each(handlers, (handler) => handler(payload));
  };
  RPC.invoke = (handler) => handlers.push(handler);
  return RPC;
};

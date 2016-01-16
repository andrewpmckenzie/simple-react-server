"use strict";

var MessageBox = require('./MessageBox.jsx');
var MessageList = require('./MessageList.jsx');
var React = require('react');

class App extends React.Component {
  render () {
    return <div>
        <MessageBox />
        <MessageList />
      </div>;
  }
}

module.exports = App;

# simple-react-server

An ExpressJS based React server made for hacking. Wired together with browserify, socket.io, and less CSS. 

Also features:
 - A basic Collection class with syncing from server to client
 - Basic RPC message passing from client to server

Note:
 - there is no persistence. The collections are kept only in memory, so will die with your app.
 - this isn't intended as a production-ready server. It's just for quick hacks / prototypes.

## To run the example
1. clone this repo
2. `npm install`
3. `make run-example`

## Basic wiring
This is a rather contrived example that wires together an 'app' that displays
'clocks' with an updating time pushed from the server. Clicking a button on the
client will add a new clock to the list.

```javascript
// index.js
var path = require('path');
var Server = require('simple-react-server').Server;

var collections = require('shared/collections');
var rpcs = require('shared/rpcs');

var server = new Server({
  collections:   collections,
  rpcs:          rpcs,
  // Anything placed in here will be served from /
  staticRoot:    path.join(__dirname, 'client/public'),
  // Anything in this folder will be available as css under /css/yourLessFileName.css
  lessRoot:      path.join(__dirname, 'client/less'),
  // The root class for the browserfy bundle
  clientAppPath: path.join(__dirname, 'client/app.js')
});
server.run();

// Handle RPC requests + update models

window.setTimeout(() => {
  collections.clocks.all().each((clock) => {
    clock.time = new Date().toString();
    clock.updates++;
    collections.update(clock.id, clock)
  });
}, 1000);

var idCounter = 0;
rpcs.addClock.invoke((options) => {
  collections.clocks.add({
    id: idCounter++,
    name: options.name,
    time: new Date().toString();
  });
});
```

```javascript
// shared/collections.js
// Collection objects used to store models. 
// Collection events: 'created', 'updated', 'deleted'.
// Collection methods: 
//   add(id, item), update(id, item), remove(id)
//   item(id):Item, all():Item[], indexed():Object.<ID,Item>
//   on(CB.<EventName, ID, Item>)
var Collection = require('simple-react-server').Collection;
module.exports = {
  clocks: new Collection()
}
```

```javascript
// shared/rpcs.js
// RPC methods used to send messages from the client to the server. 
// Handle events on the server with:
//   require('../shared/rpcs').addClock.invoke(function (request) { ... });
// Send events on the client with:
//   require('../shared/rpcs').addClock({ ...request... });
var RPC = require('simple-react-server').RPC;
module.exports = {
  addClock: new RPC()
}
```

```javascript
// client/app.js
var AppView = require('./AppView.jsx');
var Client = require('simple-react-server');
var collections = require('../shared/collections.js');
var rpcs = require('../shared/rpcs.js');

var client = new Client({ collections: collections, rpcs: rpcs });
client.render(AppView);
```

```jsx
// client/AppView.jsx
var collections = require('../shared/collections.js');
var React = require('react');
var rpcs = require('../shared/rpcs.js');

class Clock extends React.Component {
  render () { return <div>{this.props.name}: {this.props.time}</div> }
}

class AppView extends React.Component {
  constructor () {
    super();
    this.state = { clocks: [] };
  }

  componentDidMount () {
    collections.clocks.on('created', this.updateClocks.bind(this));
    collections.clocks.on('updated', this.updateClocks.bind(this));
    collections.clocks.on('deleted', this.updateClocks.bind(this));
  }

  updateClocks () { this.setState({ clocks: collections.clocks.all() }); }

  // Send an RPC message to the server
  addClock () { rpcs.addClock({ name: 'Foo clock' }); }

  renderClocks () { this.state.clocks.map((clock) => <Clock {...clock} />); }

  render () {
    return <div>
      <div className='clocks'>{this.renderClocks()}</div>
      <button onClick={this.addClock.bind(this)}>Add clock</button>
    </div>
  }
};

module.exports = AppView;
```

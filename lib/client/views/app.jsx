var ClockList = require('./ClockList.jsx');
var React = require('react');

class App extends React.Component {
  constructor () {
    super();
    this.state = { clocks: [] };
  }

  updateClocks () {
    var clocks = this.props.collections.clock.all();
    this.setState({ clocks: clocks });
  }

  componentDidMount () {
    this.props.collections.clock.on('created', this.updateClocks.bind(this));
    this.props.collections.clock.on('updated', this.updateClocks.bind(this));
    this.props.collections.clock.on('deleted', this.updateClocks.bind(this));
  }

  render () {
    return <ClockList clocks={this.state.clocks} />;
  }
}

module.exports = App;

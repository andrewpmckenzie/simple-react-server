var React = require('react');

class Clock extends React.Component {
  render () {
    return <div>{this.props.clock.time} : {this.props.clock.updates}</div>;
  }
}

class ClockList extends React.Component {
  render () {
    return <div>{this.props.clocks.map((clock) => <Clock key={clock.id} clock={clock} />)}</div>;
  }
}

module.exports = ClockList;

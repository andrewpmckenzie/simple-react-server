var React = require('react');
var addMessage = require('../../shared/rpcs').addMessage;

class MessageBox extends React.Component {
  constructor () {
    super();
    this.state = { message: '' };
  }

  onSubmit (e) {
    e.preventDefault();
    var message = this.state.message;
    addMessage({ text: message });
  }

  updateMessage (event) { this.state.message = event.target.value; }

  render () {
    return <form onSubmit={this.onSubmit.bind(this)}>
      <input type="text" onChange={this.updateMessage.bind(this)} />
      <input type="submit" />
    </form>;
  }
}

module.exports = MessageBox;

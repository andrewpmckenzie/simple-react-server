var messages = require('../../shared/collections').messages;
var React = require('react');

class Message extends React.Component {
  render () {
    return <div>{this.props.message.text}</div>;
  }
}

class MessageList extends React.Component {
  constructor () {
    super();
    this.state = { messages: [] };
  }

  componentDidMount () {
    messages.on('created', this.updateMessages.bind(this));
    messages.on('updated', this.updateMessages.bind(this));
    messages.on('deleted', this.updateMessages.bind(this));
  }

  updateMessages () {
    var allMessages = messages.all();
    this.setState({ messages: allMessages });
  }

  render () {
    return <div>{this.state.messages.map((message) => <Message key={message.id} message={message} />)}</div>;
  }
}

module.exports = MessageList;

import React, { Component, GetDerivedStateFromProps } from 'react';
import { animateScroll } from 'react-scroll';
import ChatMessage from './ChatMessage'

class ChatHistory extends Component {

  scrollToBottom = () => {
    animateScroll.scrollToBottom({
      continerId: "chatHistory"
    });
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }
  render() {
    const messages = this.props.messages.map((message, index) =>
      <ChatMessage key={index} message={message} />
    );

    return (
      <div className="chatHistory" id="chatHistory">
        {messages}
      </div>
    );
  }
}

export default ChatHistory;
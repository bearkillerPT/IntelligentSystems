import React, { Component, createRef, GetDerivedStateFromProps, useRef } from 'react';
import ChatMessage from './ChatMessage'

class ChatHistory extends Component {
  scrollToBottom = () => {
    console.log("DOWN")
    if(this.chatHistoryRef.current)
    this.chatHistoryRef.current.scrollTop = this.chatHistoryRef.current.scrollHeight;

  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }
  render() {
    this.chatHistoryRef = createRef()

    const messages = this.props.messages.map((message, index) =>
      <ChatMessage key={index} message={message} />
    );

    return (
      <div className="chatHistory" ref={this.chatHistoryRef} id="chatHistory">
        {messages}
      </div>
    );
  }
}

export default ChatHistory;
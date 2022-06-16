import React, { Component } from 'react';
import { Comment, Header } from 'semantic-ui-react';
import debounce from 'lodash.debounce';
import ChatHistory from './ChatHistory'
import ChatInput from './ChatInput'
class ChatComponent extends Component {
  constructor(props) {
    super(props);
    this.eliza = new ElizaBot();
    this.state = {
      messages: [{
        user: false,
        text: this.fixup(this.eliza.getInitial()),
        date: new Date(),
      }],
    };
    this.debounced_reply = debounce((res=>this.reply(res)), 1000, { 'maxWait': 5000 });
  }

  handleInput = (input) => {
    input = input.trim();
    if (!input)
      return;
    const messages = this.state.messages.slice(1);
    fetch(
      "https://swipl.si.bearkillerpt.xyz",
      {method: 'POST',
       headers: {'Content-Type': 'application/json'},
       body: JSON.stringify(input),
       mode: 'cors',
      }).then(e=>console.log).catch(e=>console.log);
    messages.push({
      user: true,
      text: input,
      date: new Date(),
    });
    this.setState({
      messages,
    });
    this.debounced_reply(input);
  }

  reply = (res) => {
    const messages = this.state.messages.slice(0);
    if (this.state.messages.length === 0)
      return;
    let question = this.state.messages.join(' ');
    messages.push({
      user: false,
      text: res,//this.fixup(response),
      date: new Date(),
    });
    this.setState({
      messages,
    });
  }

  fixup(text) {
    // Hack fix for weird "?" spacing in elizabot
    return text.replace(/ \?/g, '?');
  }

  render() {
    return (
      <div className="chatApp">
        <Header className="chatHeader" as='h3' block>
          Chat with ELIZA
        </Header>
        <Comment.Group className="chatBody">
          <ChatHistory messages={this.state.messages} />
          <ChatInput inputHandler={this.handleInput} />
        </Comment.Group>
      </div>
    );
  }
}

export default ChatComponent;

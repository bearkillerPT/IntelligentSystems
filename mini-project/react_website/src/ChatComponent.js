import React, { Component } from 'react';
import { Comment, Header } from 'semantic-ui-react';

import ChatHistory from './ChatHistory'
import ChatInput from './ChatInput'
import ClientAnalysis from './ComponentAnalysis'

import debounce from 'lodash.debounce';
class ChatComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [{
        user: false,
        text: this.fixup("Hello, How Can I Help You?"),
        date: new Date(),
      }],
      client: {}
    };
    this.analyzer = new ClientAnalysis()

    this.debounced_reply = debounce((res => this.reply(res)), 1000, { 'maxWait': 5000 });
  }




  handleInput = (input) => {
    input = input.trim();


    if (!input)
      return;

    var messages = this.state.messages.slice(0);
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
  reply = (input) => {
    const messages = this.state.messages.slice(0);
    if (this.state.messages.length === 0)
      return;
    var client = this.analyzer.analyze_question(this.fixup(input))

    fetch("https://nlp.si.bearkillerpt.xyz/api?query=" + this.fixup(input)).then(e => e.json()).then(e => console.log(e)).catch(e => console.log(e));
    client.Answer.forEach(element => {
      messages.push({
        user: false,
        text: element,
        date: new Date(),
      });
      this.setState({
        messages,
      });
    })
    client.Answer.forEach(element => {
      messages.push({
        user: false,
        text: element,
        date: new Date(),
      });
    })
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

        <div full-width='full-width' padding-top="0">
          {JSON.stringify(this.state.client)}
        </div>
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

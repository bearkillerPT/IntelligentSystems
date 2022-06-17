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

    this.debounced_reply = debounce(((res,q) => this.reply(res,q)), 1000, { 'maxWait': 5000 });
  }




  handleInput = (input) => {
    input = input.trim();


    if (!input)
      return;

    var messages = this.state.messages.slice(0);
    var client = this.analyzer.analyze_question(this.fixup(input))

    messages.push({
      user: true,
      text: input,
      date: new Date(),
    });
    this.setState({
      messages,
      client
    });
    this.debounced_reply(client.Answer, client['Query']);
  }


  reply = (reply, query) => {
    const messages = this.state.messages.slice(0);
    if (this.state.messages.length === 0)
      return;
    console.log(reply, query)
    if (query){
      messages.push({
        user: false,
        text: "Don't worry, we're processing your request!",
        date: new Date(),
      });
      this.setState({
        messages,
      });
      try {
        fetch('http://localhost:3009/api?query='+query)
      .then(async response => {
          const data = await response.json();

          // check for error response
          
          if (!response.ok) {
            // get error message from body or default to response statusText
            const error = (data && data.message) || response.statusText;

                       
            return Promise.reject(error);
        }
          data.forEach(element => {

            var txt = this.stringify(query, element)
            messages.push({
              user: false,
              text: txt,
              date: new Date(),
            });
          })
          this.setState({
            messages,
          });
          return data
          //attraction_type(A,B)
      })
      } catch (error) {
        messages.push({
          user: false,
          text: "Something Failed, I'm Sorry",
          date: new Date(),
        });
      this.setState({
        messages,
      });
      }
      
        
      
      
    }else{
      reply.forEach(element => {
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
      
    
  
  }

  stringify(query, object){
    var txt = ""
    Object.keys(object).forEach(element=>{
      switch(element){
        case "Price":
          txt+= "Price is "+object[element]+"€, "
          break;
        case "Class":
          txt+= object[element]+" Class, "
          break;
        
        case "Date":
          txt+= "Date: "+object[element]+", "
          break;

        case "Hour":
          txt+= "Departure at "+object[element]+"h, "
          break;
        case "Type":
          txt+= "Of type "+object[element]+", "
          break;
        case "AttractionSubtype":
            txt+= "Of Subtype "+object[element]+", "
            break;
        case "InitialLocation":
            txt+= "From "+object[element]+", "
            break;
        case "FinalLocation":
          txt+= "To "+object[element]+", "
          break;
        case "Name":
          txt+= "it is called "+object[element]+", "
          break;
        default:
          txt+=object[element]+", "
      }
    })
   
    
    return txt

  }

  fixup(text) {
    // Hack fix for weird "?" spacing in elizabot
    return text.replace(/ \?/g, '?');
  }

  render() {
    var maxPrice = "-";
    var minPrice = "-";
    if (("Price" in this.state.client) && this.state.client["Price"] != undefined){
      maxPrice = this.state.client["Price"]["Max"];
      minPrice = this.state.client["Price"]["Min"]
    }
    
    return (
      <div className="chatApp">
       
        <Header className="chatHeader" as='h3' block>
          
          <div>
            <h1>Chat with Morty!</h1>
          <p className='student_name'>User: {this.state.client.ClientName}</p>
          <p>Looking For: {this.state.client.Action}</p>
          <p>Original Location: {this.state.client.InitialLocation}</p>
          <p>Destination: {this.state.client.FinalLocation}</p>
          <p>Date: {this.state.client.Date}</p>
          <p>Max Price: {maxPrice}, Min Price: {minPrice}  </p>
       </div>
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
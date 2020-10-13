import React, { ChangeEvent, KeyboardEvent } from 'react'
import { RouteComponentProps } from "@reach/router";

import './MessageInput.css'

interface MessageInputProps extends RouteComponentProps {
  handleSendMessage: (messageBody: string) => Promise<boolean>,
}

interface MessageInputState {
  messageBody: string,
}

class MessageInput extends React.Component<MessageInputProps, MessageInputState> {
  state: MessageInputState = {
    messageBody: "",
  };

  constructor(props: MessageInputProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleChange(event: ChangeEvent<HTMLInputElement>) {
    this.setState({
      messageBody: event.target.value,
    });
  }

  async handleSendMessage() {
    if (this.state.messageBody.trim() === "") {
      return;
    }
    const success = await this.props.handleSendMessage(this.state.messageBody);
    if (success) {
      this.setState({
        messageBody: "",
      });
    }
  }

  handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      this.handleSendMessage();
    }
  }

  render() {
    return (
      <div className="MessageInput" >
        <input name="messageBody" className="MessageInput__input" type="text"
          value={this.state.messageBody} onKeyDown={this.handleKeyDown}
          onChange={this.handleChange} autoFocus={true} />
        <button
          className="MessageInput__button button"
          onClick={this.handleSendMessage}>
          Send
          </button>
      </div>
    );
  }
}

export default MessageInput;

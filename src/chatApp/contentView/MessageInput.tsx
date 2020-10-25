import React, { ChangeEvent, KeyboardEvent } from 'react'
import { RouteComponentProps } from "@reach/router";

import './MessageInput.css'

interface MessageInputProps extends RouteComponentProps {
  autoFocus: boolean,
  handleSendMessage: (messageBody: string) => boolean,
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
    this.handleClickSend = this.handleClickSend.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleChange(event: ChangeEvent<HTMLInputElement>) {
    this.setState({
      messageBody: event.target.value,
    });
  }

  async handleClickSend() {
    if (this.state.messageBody.trim() === "") {
      return;
    }
    const success = this.props.handleSendMessage(this.state.messageBody);
    if (success) {
      this.setState({
        messageBody: "",
      });
    }
  }

  handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      this.handleClickSend();
    }
  }

  render() {
    return (
      <div className="MessageInput" >
        <input
          name="messageBody"
          className="MessageInput__input"
          type="text"
          value={this.state.messageBody}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
          autoFocus={this.props.autoFocus}
          placeholder="Type a message" />
        <button
          className="MessageInput__button button"
          onClick={this.handleClickSend}>
          Send
          </button>
      </div>
    );
  }
}

export default MessageInput;

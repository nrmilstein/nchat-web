import React, { ChangeEvent } from 'react'
import { RouteComponentProps } from "@reach/router";

import { Conversation } from '../../models/Conversation';

import './ConversationViewBanner.css'

interface ConversationViewBannerProps extends RouteComponentProps {
  handleEmailChange: (email: string) => void,
  conversation: Conversation,
}

interface ConversationViewBannerState {
  email: string,
}

class ConversationViewBanner
  extends React.Component<ConversationViewBannerProps, ConversationViewBannerState> {
  state = {
    email: this.props.conversation.conversationPartner.email ?? "",
  }

  constructor(props: ConversationViewBannerProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.value;
    this.props.handleEmailChange(newValue);
    this.setState({
      email: newValue,
    });
  }

  render() {
    let contents: JSX.Element;

    if (this.props.conversation.isEditable) {
      contents =
        <div className="ConversationViewBanner__toField">
          <label className="ConversationViewBanner__toFieldLabel">To:
          <input
              type="text"
              className="ConversationViewBanner__input"
              placeholder="Email"
              value={this.state.email}
              onChange={this.handleChange}
              autoFocus={true} />
          </label>
        </div>
    } else {
      contents =
        <div className="ConversationViewBanner__email">
          {this.props.conversation.conversationPartner.name
            ?? this.props.conversation.conversationPartner.email}
        </div>
    }

    return (
      <header className="ConversationViewBanner" >
        {contents}
      </header>
    );
  }
}

export default ConversationViewBanner;
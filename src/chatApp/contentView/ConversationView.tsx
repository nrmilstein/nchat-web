import React from 'react';
import { RouteComponentProps } from "@reach/router";

import { Conversation } from '../../models/Conversation';
import ConversationViewBanner from './ConversationViewBanner';
import MessagesView from './MessagesView';
import MessageInput from './MessageInput';

import './ConversationView.css'
import ConversationStubList from '../sidebar/ConversationStubList';

interface ConversationViewProps extends RouteComponentProps {
  conversation: Conversation,
  handleSendMessage: (messageBody: string, conversation: Conversation) => Promise<boolean>,
}

interface ConversationViewState {
  email: string,
}

class ConversationView extends React.Component<ConversationViewProps, {}> {
  state: ConversationViewState = {
    email: this.props.conversation.conversationPartner.email ?? "",
  }
  constructor(props: ConversationViewProps) {
    super(props);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  handleEmailChange(email: string) {
    this.setState({
      email: email,
    });
  }

  handleSendMessage(messageBody: string): Promise<boolean> {
    let conversation = this.props.conversation;
    if (conversation.isEditable) {
      conversation = {
        ...this.props.conversation,
        conversationPartner: {
          ...this.props.conversation.conversationPartner,
          email: this.state.email,
        }
      }
    }
    return this.props.handleSendMessage(messageBody, conversation);
  }

  render() {
    return (
      <div className="ConversationView" >
        <ConversationViewBanner
          conversation={this.props.conversation}
          handleEmailChange={this.handleEmailChange} />
        <MessagesView
          messages={this.props.conversation.messages} />
        <MessageInput handleSendMessage={this.handleSendMessage} />
      </div>
    );
  }
}

export default ConversationView
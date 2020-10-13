import React from 'react';
import { RouteComponentProps } from "@reach/router";

import ConversationViewBanner from './ConversationViewBanner';
import ConversationView from './ConversationView';
import MessageInput from './MessageInput';
import Conversation from '../../models/Conversation';

import "./ContentView.css"

interface ContentViewProps extends RouteComponentProps {
  conversation: Conversation,
  handleSendMessage: (messageBody: string) => Promise<boolean>,
}

class ContentView extends React.Component<ContentViewProps, {}> {

  render() {
    return (
      <div className="ContentView">
        <ConversationViewBanner conversation={this.props.conversation} />
        <ConversationView
          conversation={this.props.conversation} />
        <MessageInput handleSendMessage={this.props.handleSendMessage} />
      </div>
    );
  }
}

export default ContentView;

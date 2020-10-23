import React from 'react';
import { RouteComponentProps } from "@reach/router";

import { Conversation } from '../../models/Conversation';
import ConversationView from './ConversationView';

import "./ContentView.css"

interface ContentViewProps extends RouteComponentProps {
  conversation: Conversation | null,
  handleSendMessage: (messageBody: string, conversation: Conversation) => Promise<boolean>,
}

class ContentView extends React.Component<ContentViewProps, {}> {
  render() {
    return (
      <main className="ContentView" >
        {this.props.conversation !== null &&
          <ConversationView
            conversation={this.props.conversation}
            handleSendMessage={this.props.handleSendMessage}
            key={this.props.conversation?.uuid} />}
      </main>
    )
  }
}

export default ContentView;

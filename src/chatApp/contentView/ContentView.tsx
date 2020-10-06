import React from 'react';
import { RouteComponentProps } from "@reach/router";

import ConversationViewBanner from './ConversationViewBanner';
import ConversationView from './ConversationView';
import MessageInput from './MessageInput';
import Conversation from '../../models/Conversation';

import "./ContentView.css"

interface ContentViewProps extends RouteComponentProps {
  conversation: Conversation | null,
  handleSend: (messageBody: string) => Promise<boolean>,
  setScrollToBottomHandler: (scrollToBottomHandler: () => void) => void,
}

class ContentView extends React.Component<ContentViewProps, {}> {

  render() {
    return (
      <main className="ContentView">
        <ConversationViewBanner conversation={this.props.conversation} />
        <ConversationView conversation={this.props.conversation}
          setScrollToBottomHandler={this.props.setScrollToBottomHandler} />
        <MessageInput handleSend={this.props.handleSend} />
      </main>
    );
  }
}

export default ContentView;

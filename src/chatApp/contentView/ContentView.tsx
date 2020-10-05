import React from 'react';
import { RouteComponentProps } from "@reach/router";

import ConversationViewBanner from './ConversationViewBanner';
import ConversationView from './ConversationView';
import MessageInput from './MessageInput';
import Conversation from '../../models/Conversation';

import "./ContentView.css"

interface ContentViewProps extends RouteComponentProps {
  conversation: Conversation | null;
}

function ContentView(props: ContentViewProps) {
  return (
    <main className="ContentView">
      <ConversationViewBanner />
      <ConversationView conversation={props.conversation} />
      <MessageInput />
    </main>
  );
}

export default ContentView;

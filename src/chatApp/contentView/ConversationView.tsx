import React from 'react';
import { RouteComponentProps } from "@reach/router";

import { Conversation } from '../../models/Conversation';
import ConversationViewBanner from './ConversationViewBanner';
import MessagesView from './MessagesView';
import MessageInput from './MessageInput';

import './ConversationView.css'

interface ConversationViewProps extends RouteComponentProps {
  conversation: Conversation,
  handleSendMessage: (messageBody: string) => Promise<boolean>,
}

function ConversationView(props: ConversationViewProps) {
  return (
    <div className="ConversationView">
      <ConversationViewBanner conversation={props.conversation} />
      <MessagesView
        messages={props.conversation.messages} />
      <MessageInput handleSendMessage={props.handleSendMessage} />
    </div>
  );
}

export default ConversationView
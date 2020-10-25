import React from 'react';
import { RouteComponentProps } from "@reach/router";

import { Conversation } from '../../models/Conversation';
import ConversationViewBanner from './ConversationViewBanner';
import MessagesView from './MessagesView';
import MessageInput from './MessageInput';

import './ConversationView.css'

interface ConversationViewProps extends RouteComponentProps {
  selectedConversation: Conversation,
  handleSendMessage: (messageBody: string) => void,
}

function ConversationView(props: ConversationViewProps) {
  return (
    <div className="ConversationView" >
      <ConversationViewBanner
        selectedConversation={props.selectedConversation} />
      <MessagesView
        isLoading={props.selectedConversation.isLoading}
        messages={props.selectedConversation.messages} />
      <MessageInput
        autoFocus={true}
        handleSendMessage={
          (messageBody) => {
            props.handleSendMessage(messageBody);
            return true;
          }
        } />
    </div>
  );
}

export default ConversationView
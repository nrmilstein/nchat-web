import React from 'react';
import { RouteComponentProps } from "@reach/router";

import { Conversation } from '../../models/Conversation';
import ConversationViewBanner from './ConversationViewBanner';
import MessagesView from './MessagesView';
import MessageInput from './MessageInput';

import styles from './ConversationView.module.css'

interface ConversationViewProps extends RouteComponentProps {
  selectedConversation: Conversation,
  handleSendMessage: (messageBody: string) => void,
}

function ConversationView(props: ConversationViewProps) {
  const autoFocus = window.matchMedia("(hover: hover)").matches;

  return (
    <div className={styles.main} >
      <ConversationViewBanner
        selectedConversation={props.selectedConversation} />
      <MessagesView
        isLoading={props.selectedConversation.isLoading}
        messages={props.selectedConversation.messages} />
      <MessageInput
        autoFocus={autoFocus}
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
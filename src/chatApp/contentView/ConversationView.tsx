import React from 'react'
import { RouteComponentProps } from "@reach/router";

import MessageView from './MessageView';
import Conversation from '../../models/Conversation';

import './ConversationView.css'

interface ConversationViewProps extends RouteComponentProps {
  conversation: Conversation | null,
}

function ConversationView(props: ConversationViewProps) {
  let messages: JSX.Element[] = [];
  if (props.conversation !== null) {
    messages = props.conversation.messages.map(message => {
      return <MessageView message={message} />
    });
  }
  return (
    <div className="ConversationView">
      {messages}
    </div>
  );
}

export default ConversationView;

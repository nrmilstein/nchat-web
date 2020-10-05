import React from 'react'
import { RouteComponentProps } from "@reach/router";

import MessageView from './MessageView';
import Conversation from '../../models/Conversation';

import './ConversationView.css'

interface ConversationViewProps extends RouteComponentProps {
  conversation: Conversation | null,
}

function ConversationView(props: ConversationViewProps) {
  let messages = [];
  if (props.conversation !== null) {
    messages = props.conversation.messages.map(message => {
      return <MessageView message={message} />
    });
  }
  return (
    <div className="ConversationView">
      <div className="MessageView">hey</div>
      <div className="MessageView">hey</div>
      <div className="MessageView">hey</div>
      <div className="MessageView">hey</div>
      <div className="MessageView">hey</div>
      <div className="MessageView">hey</div>
      <div className="MessageView">hey</div>
      <div className="MessageView">hey</div>
      <div className="MessageView">hey</div>
      <div className="MessageView">hey</div>
      <div className="MessageView">hey</div>
      <div className="MessageView">hey</div>
      <div className="MessageView">hey</div>
      <div className="MessageView">hey</div>
      <div className="MessageView">hey</div>
      <div className="MessageView">hey</div>
      <div className="MessageView">hey</div>
      <div className="MessageView">hey</div>
      <div className="MessageView">hey</div>
      <div className="MessageView">hey</div>
      <div className="MessageView">hey</div>
      <div className="MessageView">hey</div>
      <div className="MessageView">hey</div>
      <div className="MessageView">hey</div>
    </div>
  );
}

export default ConversationView;

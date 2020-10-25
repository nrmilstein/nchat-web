import React from 'react';
import { RouteComponentProps } from "@reach/router";

import { Conversation } from '../../models/Conversation';
import ConversationView from './ConversationView';
import ConversationCreatorView from './ConversationCreatorView';
import { User } from '../../models/User';

import "./ContentView.css"

interface ContentViewProps extends RouteComponentProps {
  isConversationCreatorOpen: boolean,
  selectedConversation: Conversation | null,
  handleSendMessage: (messageBody: string, user?: User) => void,
}

function ContentView(props: ContentViewProps) {
  return (
    <main className="ContentView" >
      {
        props.isConversationCreatorOpen
          ?
          <ConversationCreatorView
            handleSendMessage={props.handleSendMessage} />
          :
          props.selectedConversation !== null
          && <ConversationView
            selectedConversation={props.selectedConversation}
            handleSendMessage={props.handleSendMessage}
            key={props.selectedConversation?.uuid} />
      }
    </main>
  )
}

export default ContentView;
